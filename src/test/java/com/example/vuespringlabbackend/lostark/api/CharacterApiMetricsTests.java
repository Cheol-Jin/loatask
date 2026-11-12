package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import com.example.vuespringlabbackend.config.CharacterMetricsLogConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static com.example.vuespringlabbackend.lostark.api.CharacterApiMetrics.Kind.*;
import static org.mockito.Mockito.*;

class CharacterApiMetricsTests {
    @Test
    void hitsMissesStaleAndFailuresHaveSeparateCountsAndTimings() {
        var time = new AtomicLong();
        var metrics = new CharacterApiMetrics();
        var cache = new CharacterResponseCache<String>(2, time::get, metrics, PROFILE);
        assertEquals("cached", cache.get("private-character", () -> {
            time.addAndGet(Duration.ofMillis(80).toNanos());
            return "cached";
        }));
        assertEquals("cached", cache.get("private-character", () -> fail("cache hit")));
        time.addAndGet(Duration.ofSeconds(60).toNanos());
        assertEquals("cached", cache.get("private-character", () -> {
            throw new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE, "temporary", "private", true);
        }));
        assertEquals("cached", cache.get("private-character", () -> fail("cooldown")));
        assertThrows(IllegalStateException.class, () -> cache.get("other", () -> {
            throw new IllegalStateException("private");
        }));
        var s = metrics.snapshot(PROFILE);
        assertEquals(5, s.requests());
        assertEquals(5, s.completed());
        assertEquals(2, s.cacheHits());
        assertEquals(3, s.cacheMisses());
        assertEquals(2, s.staleResponses());
        assertEquals(1, s.failedRequests());
        assertEquals(40, s.hitRatePercent());
        assertEquals(16, s.requestMeanMs(), .001);
        assertEquals(80, s.requestMaxMs(), .001);
        assertEquals(0, metrics.snapshot(ARMORY).requests());
        assertFalse(metrics.logLine(PROFILE).contains("private"));
        assertFalse(metrics.logLine(PROFILE).contains("NaN"));
    }

    @ParameterizedTest
    @CsvSource({"429,RATE_LIMITED", "503,SERVER_ERROR", "404,HTTP_ERROR", "401,HTTP_ERROR"})
    void officialHttpFailuresAreCountedDespiteMappedResponseStatus(int status, String expected) {
        var builder = RestClient.builder().baseUrl("https://official.invalid");
        var mock = MockRestServiceServer.bindTo(builder).build();
        mock.expect(requestTo("https://official.invalid/armories/characters/test/profiles"))
                .andRespond(withStatus(HttpStatus.valueOf(status)).body("private"));
        var metrics = new CharacterApiMetrics();
        var client = new LostArkOpenApiClient(builder.build(), System::nanoTime, metrics);
        assertThrows(CharacterProfileException.class, () -> client.getCharacterProfile("test"));
        var s = metrics.snapshot(PROFILE);
        assertEquals(1, s.upstreamCalls());
        assertEquals(1, s.failedRequests());
        assertEquals(expected.equals("RATE_LIMITED") ? 1 : 0, s.rateLimited());
        assertEquals(expected.equals("SERVER_ERROR") ? 1 : 0, s.serverErrors());
        assertEquals(expected.equals("HTTP_ERROR") ? 1 : 0, s.httpErrors());
        assertFalse(metrics.logLine(PROFILE).contains("private"));
        mock.verify();
    }

    @Test
    void invalidResponseAndConnectionFailuresAreRecordedSeparately() {
        var builder = RestClient.builder().baseUrl("https://official.invalid");
        var mock = MockRestServiceServer.bindTo(builder).build();
        mock.expect(requestTo("https://official.invalid/armories/characters/test/profiles"))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));
        mock.expect(requestTo("https://official.invalid/armories/characters/test/profiles"))
                .andRespond(request -> { throw new java.io.IOException("private-connection"); });
        var metrics = new CharacterApiMetrics();
        var client = new LostArkOpenApiClient(builder.build(), System::nanoTime, metrics);
        assertThrows(CharacterProfileException.class, () -> client.getCharacterProfile("test"));
        assertThrows(CharacterProfileException.class, () -> client.getCharacterProfile("test"));
        assertEquals(1, metrics.snapshot(PROFILE).invalidResponses());
        assertEquals(1, metrics.snapshot(PROFILE).connectionErrors());
        assertEquals(2, metrics.snapshot(PROFILE).upstreamCalls());
        mock.verify();
    }

    @Test
    void detailMetricsAreSeparateAndSchedulerEmitsOnlyAggregates() {
        var builder = RestClient.builder().baseUrl("https://official.invalid");
        var mock = MockRestServiceServer.bindTo(builder).build();
        mock.expect(request -> assertTrue(request.getURI().getPath().endsWith("/test")))
                .andRespond(withSuccess("{\"ArmoryProfile\":{\"CharacterName\":\"test\"}}", MediaType.APPLICATION_JSON));
        var metrics = new CharacterApiMetrics();
        var client = new LostArkOpenApiClient(builder.build(), System::nanoTime, metrics);
        client.getCharacterArmory("test");
        client.getCharacterArmory("test");
        assertEquals(0, metrics.snapshot(PROFILE).requests());
        var s = metrics.snapshot(ARMORY);
        assertEquals(2, s.requests());
        assertEquals(1, s.cacheHits());
        assertEquals(1, s.upstreamSuccesses());
        assertTrue(s.upstreamMaxMs() >= s.upstreamMeanMs());
        var spy = spy(metrics);
        new CharacterMetricsLogConfig(spy).logMetrics();
        verify(spy).logLine(PROFILE);
        verify(spy).logLine(ARMORY);
        mock.verify();
    }

    @Test
    void comparesRepeatedAndDistinctCharacterLookups() {
        for (boolean repeated : new boolean[]{true, false}) {
            var builder = RestClient.builder().baseUrl("https://official.invalid");
            var mock = MockRestServiceServer.bindTo(builder).build();
            mock.expect(ExpectedCount.times(repeated ? 1 : 20), request -> {})
                    .andRespond(request -> {
                        try {
                            Thread.sleep(40);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            throw new java.io.IOException(e);
                        }
                        String name = request.getURI().getPath().split("/")[3];
                        return withSuccess("{\"CharacterName\":\"" + name + "\"}", MediaType.APPLICATION_JSON)
                                .createResponse(request);
                    });
            var metrics = new CharacterApiMetrics();
            var client = new LostArkOpenApiClient(builder.build(), System::nanoTime, metrics);
            for (int i = 0; i < 20; i++) client.getCharacterProfile("test" + (repeated ? 0 : i));
            var s = metrics.snapshot(PROFILE);
            assertEquals(20, s.requests());
            assertEquals(repeated ? 19 : 0, s.cacheHits());
            assertEquals(repeated ? 1 : 20, s.upstreamCalls());
            assertEquals(s.completed(), s.cacheHits() + s.cacheMisses());
            System.out.println("METRICS_COMPARISON scenario=" + (repeated ? "repeated" : "distinct") + " " + metrics.logLine(PROFILE));
            mock.verify();
        }
    }
}
