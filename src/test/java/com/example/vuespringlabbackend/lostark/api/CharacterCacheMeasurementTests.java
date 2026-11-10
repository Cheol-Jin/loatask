package com.example.vuespringlabbackend.lostark.api;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class CharacterCacheMeasurementTests {
    private static final int REQUESTS = 20;

    @Test
    void measuresRepeatedLookupsWithAndWithoutCacheHits() {
        measure(false, 1); // 워밍업은 결과에서 제외합니다.
        measure(true, 1);
        var baseline = measure(false, REQUESTS);
        var cached = measure(true, REQUESTS);
        assertEquals(REQUESTS, baseline.calls());
        assertEquals(1, cached.calls());
        System.out.printf("CACHE_MEASUREMENT baseline calls=%d mean=%.3f ms p95=%.3f ms%n",
                baseline.calls(), baseline.mean(), baseline.p95());
        System.out.printf("CACHE_MEASUREMENT cached calls=%d mean=%.3f ms p95=%.3f ms%n",
                cached.calls(), cached.mean(), cached.p95());
    }

    private Result measure(boolean cacheHits, int requests) {
        var ticker = new AtomicLong();
        var calls = new AtomicInteger();
        var builder = RestClient.builder().baseUrl("https://official-api.invalid");
        var mock = MockRestServiceServer.bindTo(builder).build();
        mock.expect(ExpectedCount.times(cacheHits ? 1 : requests),
                requestTo("https://official-api.invalid/armories/characters/test/profiles"))
                .andRespond(request -> {
                    calls.incrementAndGet();
                    try {
                        Thread.sleep(80);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new java.io.IOException(e);
                    }
                    return withSuccess("{\"CharacterName\":\"test\"}", MediaType.APPLICATION_JSON)
                            .createResponse(request);
                });
        var client = new LostArkOpenApiClient(builder.build(), ticker::get);
        var times = new double[requests];
        for (int i = 0; i < requests; i++) {
            // 기준선은 매번 만료시켜 같은 HTTP·역직렬화 경로를 실행합니다.
            if (!cacheHits) ticker.addAndGet(Duration.ofSeconds(60).toNanos());
            long start = System.nanoTime();
            assertEquals("test", client.getCharacterProfile("test").characterName());
            times[i] = (System.nanoTime() - start) / 1_000_000.0;
        }
        mock.verify();
        Arrays.sort(times);
        return new Result(calls.get(), Arrays.stream(times).average().orElseThrow(),
                times[(int) Math.ceil(requests * .95) - 1]);
    }

    private record Result(int calls, double mean, double p95) {}
}
