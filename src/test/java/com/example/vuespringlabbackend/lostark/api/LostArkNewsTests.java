package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.controller.LostArkHomeController;
import com.example.vuespringlabbackend.lostark.exception.GlobalExceptionHandler;
import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.*;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestClient;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class LostArkNewsTests {
    private MockRestServiceServer upstream;
    private LostArkNewsClient client;
    private MockMvc mvc;
    private final AtomicLong clock = new AtomicLong();
    private final CharacterApiMetrics metrics = new CharacterApiMetrics();
    private static final String NOTICES = "[{\"Title\":\"점검 안내\",\"Date\":\"2026-11-13T10:00:00\",\"Type\":\"점검\",\"Link\":\"https://lostark.game.onstove.com/News/Notice/Views/1\"}]";
    @BeforeEach void setup() {
        var builder = RestClient.builder().baseUrl("https://official.invalid");
        upstream = MockRestServiceServer.bindTo(builder).build();
        client = new LostArkNewsClient(builder.build(), metrics, clock::get);
        mvc = MockMvcBuilders.standaloneSetup(new LostArkHomeController(client))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }
    @Test void mapsAndCachesNoticesWithoutSharingCharacterMetrics() throws Exception {
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withSuccess(NOTICES, MediaType.APPLICATION_JSON));
        mvc.perform(get("/api/lostark/home/notices")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("점검 안내"))
                .andExpect(jsonPath("$[0].type").value("점검"));
        clock.set(Duration.ofMinutes(9).toNanos());
        assertEquals(1, client.notices().size());
        assertEquals(1, metrics.snapshot(CharacterApiMetrics.Kind.NOTICE).upstreamCalls());
        assertEquals(0, metrics.snapshot(CharacterApiMetrics.Kind.PROFILE).requests());
        upstream.verify();
    }
    @Test void eventsCanSucceedWhenNoticesFail() throws Exception {
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE));
        upstream.expect(requestTo("https://official.invalid/news/events")).andRespond(withSuccess(
                "[{\"Title\":\"모험\",\"StartDate\":\"2026-11-01T10:00:00\",\"EndDate\":\"2026-12-01T10:00:00\"}]", MediaType.APPLICATION_JSON));
        mvc.perform(get("/api/lostark/home/notices")).andExpect(status().isBadGateway());
        mvc.perform(get("/api/lostark/home/events")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("모험"))
                .andExpect(jsonPath("$[0].endDate").value("2026-12-01T10:00:00"));
        upstream.verify();
    }
    @Test void expiresAfterTenMinutesFallsBackAndStopsAfterOneHour() {
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withSuccess(NOTICES, MediaType.APPLICATION_JSON));
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE));
        client.notices();
        clock.set(Duration.ofMinutes(10).toNanos());
        assertEquals(1, client.notices().size());
        clock.set(Duration.ofMinutes(10).plusSeconds(59).toNanos());
        assertEquals(1, client.notices().size());
        clock.set(Duration.ofHours(1).toNanos());
        assertThrows(CharacterProfileException.class, client::notices);
        upstream.verify();
    }
    @ParameterizedTest @CsvSource({"401", "429", "500"})
    void neverLeaksUpstreamBody(int status) throws Exception {
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withStatus(HttpStatus.valueOf(status)).body("private-key"));
        mvc.perform(get("/api/lostark/home/notices")).andExpect(status().isBadGateway())
                .andExpect(content().string(not(containsString("private-key"))));
        upstream.verify();
    }
    @Test void invalidResponseIsNotCached() {
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withSuccess("[null]", MediaType.APPLICATION_JSON));
        upstream.expect(requestTo("https://official.invalid/news/notices")).andRespond(withSuccess("[]", MediaType.APPLICATION_JSON));
        assertThrows(CharacterProfileException.class, client::notices);
        assertTrue(client.notices().isEmpty());
        upstream.verify();
    }
}
