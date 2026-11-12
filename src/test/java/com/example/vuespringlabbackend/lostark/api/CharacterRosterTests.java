package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.controller.LostArkController;
import com.example.vuespringlabbackend.lostark.exception.GlobalExceptionHandler;
import com.example.vuespringlabbackend.lostark.search.service.CharacterSearchService;
import com.example.vuespringlabbackend.lostark.service.LostArkCharacterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CharacterRosterTests {
    private static final String API = "/api/lostark/official/characters/test/roster";
    private static final String OFFICIAL = "https://official.invalid/characters/test/siblings";
    private static final String ROSTER = """
            [
              {"ServerName":"카제로스","CharacterName":"test","CharacterLevel":70,
               "CharacterClassName":"소서리스","ItemAvgLevel":"1,751.66","NewField":"ignored"},
              {"ServerName":"루페온","CharacterName":"other","CharacterLevel":60,
               "CharacterClassName":"바드","ItemAvgLevel":"1,600.00"}
            ]
            """;
    private final AtomicLong clock = new AtomicLong();
    private final CharacterApiMetrics metrics = new CharacterApiMetrics();
    private MockRestServiceServer upstream;
    private MockMvc mvc;
    private LostArkOpenApiClient client;
    private CharacterSearchService searches;

    @BeforeEach
    void setUp() {
        var builder = RestClient.builder().baseUrl("https://official.invalid");
        upstream = MockRestServiceServer.bindTo(builder).build();
        client = new LostArkOpenApiClient(builder.build(), clock::get, metrics);
        searches = mock(CharacterSearchService.class);
        mvc = MockMvcBuilders.standaloneSetup(
                new LostArkController(mock(LostArkCharacterService.class), client, searches))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    @Test
    void mapsAllServersCachesAndDoesNotRecordSearches() throws Exception {
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess(ROSTER, MediaType.APPLICATION_JSON));
        mvc.perform(get(API)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].characterName").value("test"))
                .andExpect(jsonPath("$[0].characterClassName").value("소서리스"))
                .andExpect(jsonPath("$[0].characterLevel").value(70))
                .andExpect(jsonPath("$[0].itemAvgLevel").value("1,751.66"))
                .andExpect(jsonPath("$[1].serverName").value("루페온"))
                .andExpect(jsonPath("$[0].CharacterName").doesNotExist());
        assertEquals(2, client.getCharacterRoster(" test ").size());
        var stats = metrics.snapshot(CharacterApiMetrics.Kind.ROSTER);
        assertEquals(2, stats.requests());
        assertEquals(1, stats.upstreamSuccesses());
        assertEquals(1, stats.cacheHits());
        assertEquals(0, metrics.snapshot(CharacterApiMetrics.Kind.PROFILE).requests());
        verifyNoInteractions(searches);
        upstream.verify();
    }

    @Test
    void emptyListIsValidAndCached() throws Exception {
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess("[]", MediaType.APPLICATION_JSON));
        mvc.perform(get(API)).andExpect(status().isOk()).andExpect(content().json("[]"));
        mvc.perform(get(API)).andExpect(status().isOk()).andExpect(content().json("[]"));
        verifyNoInteractions(searches);
        upstream.verify();
    }

    @ParameterizedTest
    @CsvSource({"404,404", "401,502", "429,503", "503,502"})
    void forwardsSafeErrorsWithoutRecordingSearches(int officialStatus, int responseStatus) throws Exception {
        upstream.expect(requestTo(OFFICIAL))
                .andRespond(withStatus(HttpStatus.valueOf(officialStatus)).body("private-upstream-data"));
        mvc.perform(get(API)).andExpect(status().is(responseStatus))
                .andExpect(content().string(not(containsString("private-upstream-data"))));
        verifyNoInteractions(searches);
        upstream.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "[null]", "[{\"ServerName\":\"test\"}]", "not-json"})
    void malformedRosterIsNotCached(String body) throws Exception {
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess(ROSTER, MediaType.APPLICATION_JSON));
        mvc.perform(get(API)).andExpect(status().isBadGateway());
        mvc.perform(get(API)).andExpect(status().isOk());
        upstream.verify();
    }

    @Test
    void noContentIsNotFound() throws Exception {
        upstream.expect(requestTo(OFFICIAL)).andRespond(withNoContent());
        mvc.perform(get(API)).andExpect(status().isNotFound());
        upstream.verify();
    }

    @Test
    void expiredRosterFallsBackOnTransientErrorThenRefreshes() throws Exception {
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess(ROSTER, MediaType.APPLICATION_JSON));
        upstream.expect(requestTo(OFFICIAL)).andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));
        upstream.expect(requestTo(OFFICIAL)).andRespond(withSuccess("[]", MediaType.APPLICATION_JSON));
        mvc.perform(get(API)).andExpect(status().isOk());
        clock.set(Duration.ofSeconds(60).toNanos());
        mvc.perform(get(API)).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get(API)).andExpect(status().isOk());
        clock.set(Duration.ofSeconds(75).toNanos());
        mvc.perform(get(API)).andExpect(status().isOk()).andExpect(content().json("[]"));
        var stats = metrics.snapshot(CharacterApiMetrics.Kind.ROSTER);
        assertEquals(3, stats.upstreamCalls());
        assertEquals(1, stats.rateLimited());
        assertEquals(2, stats.staleResponses());
        verifyNoInteractions(searches);
        upstream.verify();
    }
}
