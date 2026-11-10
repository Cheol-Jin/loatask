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
import org.springframework.test.web.client.ResponseActions;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CharacterProfileErrorTests {

    private static final String PROFILE_URL = "/api/lostark/official/characters/test-character/profile";
    private final AtomicLong time = new AtomicLong();
    private MockRestServiceServer officialApi;
    private MockMvc mvc;
    private CharacterSearchService searches;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://official-api.invalid");
        officialApi = MockRestServiceServer.bindTo(builder).build();
        searches = mock(CharacterSearchService.class);
        LostArkController controller = new LostArkController(mock(LostArkCharacterService.class),
                new LostArkOpenApiClient(builder.build(), time::get), searches);
        mvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    @Test
    void successfulProfileKeepsFrontendFieldNamesAndRecordsSearch() throws Exception {
        expectRequest().andRespond(withSuccess("""
                {"CharacterName":"test-character","ServerName":"test-server"}
                """, MediaType.APPLICATION_JSON));
        mvc.perform(get(PROFILE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.characterName").value("test-character"))
                .andExpect(jsonPath("$.serverName").value("test-server"));
        verify(searches).recordSearch("test-character");
        officialApi.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"null", "{}", "{\"CharacterName\":\" \"}"})
    void emptyProfileReturnsNotFoundWithoutRecordingSearch(String body) throws Exception {
        expectRequest().andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertFailure(404, "CHARACTER_NOT_FOUND");
    }

    @Test
    void noContentReturnsNotFound() throws Exception {
        expectRequest().andRespond(withNoContent());
        assertFailure(404, "CHARACTER_NOT_FOUND");
    }

    @ParameterizedTest
    @CsvSource({"404,404,CHARACTER_NOT_FOUND", "401,502,LOSTARK_API_ERROR",
            "403,502,LOSTARK_API_ERROR", "429,503,LOSTARK_RATE_LIMITED", "500,502,LOSTARK_API_ERROR"})
    void officialApiErrorsReturnSafeMessages(int upstreamStatus, int responseStatus, String code) throws Exception {
        expectRequest().andRespond(withStatus(HttpStatus.valueOf(upstreamStatus))
                .contentType(MediaType.TEXT_PLAIN).body("private-upstream-error"));
        assertFailure(responseStatus, code);
    }

    @Test
    void connectionFailureReturnsServiceUnavailable() throws Exception {
        expectRequest().andRespond(request -> {
            throw new IOException("private-connection-details");
        });
        assertFailure(503, "LOSTARK_CONNECTION_ERROR");
    }

    @Test
    void unreadableProfileReturnsBadGateway() throws Exception {
        expectRequest().andRespond(withSuccess("not-json", MediaType.APPLICATION_JSON));
        assertFailure(502, "LOSTARK_API_ERROR");
    }

    @Test
    void armoryMapsNestedOfficialFieldsAndRecordsOnlyOneSearch() throws Exception {
        expectArmory().andRespond(withSuccess("""
                {
                  "ArmoryProfile":{"CharacterName":"test-character","CombatPower":"123,456",
                    "Stats":[{"Type":"특화","Value":"1800","Tooltip":[]}],
                    "Tendencies":[{"Type":"지성","Point":500,"MaxPoint":1000}]},
                  "ArmoryEquipment":[{"Type":"무기","Name":"테스트 무기","Grade":"고대","Tooltip":"{}"}],
                  "ArmoryEngraving":{"Effects":null,"ArkPassiveEffects":[{"Name":"원한","Level":4,"Grade":"유물","AbilityStoneLevel":2}]},
                  "ArmoryGem":{"Gems":[{"Slot":0,"Name":"겁화","Level":10}],
                    "Effects":{"Skills":[{"GemSlot":0,"Name":"종말의 날","Description":["피해 증가"]}]}},
                  "ArmoryCard":{"Cards":[{"Slot":0,"Name":"카단","AwakeCount":5,"AwakeTotal":5}],
                    "Effects":[{"Items":[{"Name":"세트 효과","Description":"피해 증가"}]}]},
                  "ArmorySkills":[{"Name":"종말의 날","Level":14,"Tripods":[{"Tier":1,"Name":"선택","IsSelected":true}]}],
                  "ArkPassive":{"IsArkPassive":true,"Points":[{"Name":"진화","Value":120}],"Effects":[]}
                }
                """, MediaType.APPLICATION_JSON));
        mvc.perform(get("/api/lostark/official/characters/test-character/armory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.characterName").value("test-character"))
                .andExpect(jsonPath("$.profile.combatPower").value("123,456"))
                .andExpect(jsonPath("$.profile.stats[0].value").value("1800"))
                .andExpect(jsonPath("$.equipment[0].type").value("무기"))
                .andExpect(jsonPath("$.engravings.arkPassiveEffects[0].abilityStoneLevel").value(2))
                .andExpect(jsonPath("$.gems.effects.skills[0].gemSlot").value(0))
                .andExpect(jsonPath("$.cards.cards[0].awakeCount").value(5))
                .andExpect(jsonPath("$.skills[0].tripods[0].selected").value(true))
                .andExpect(jsonPath("$.arkPassive.active").value(true));
        verify(searches, times(1)).recordSearch("test-character");
        officialApi.verify();
    }

    @Test
    void armoryAllowsUnequippedCharacters() throws Exception {
        expectArmory().andRespond(withSuccess("""
                {"ArmoryProfile":{"CharacterName":"test-character"},"ArmoryEquipment":null,"ArmorySkills":null}
                """, MediaType.APPLICATION_JSON));
        mvc.perform(get("/api/lostark/official/characters/test-character/armory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equipment").isEmpty())
                .andExpect(jsonPath("$.skills").isEmpty());
        officialApi.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"null", "{}", "{\"ArmoryProfile\":{}}"})
    void emptyArmoryDoesNotRecordSearch(String body) throws Exception {
        expectArmory().andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        mvc.perform(get("/api/lostark/official/characters/test-character/armory"))
                .andExpect(status().isNotFound());
        verifyNoInteractions(searches);
        officialApi.verify();
    }

    @Test
    void armoryRateLimitDoesNotLeakUpstreamResponse() throws Exception {
        expectArmory().andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS).body("private-upstream-error"));
        mvc.perform(get("/api/lostark/official/characters/test-character/armory"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("LOSTARK_RATE_LIMITED"))
                .andExpect(content().string(not(containsString("private-"))));
        verifyNoInteractions(searches);
        officialApi.verify();
    }

    private ResponseActions expectArmory() {
        return officialApi.expect(requestTo("https://official-api.invalid/armories/characters/test-character"
                + "?filters=profiles%2Bequipment%2Bengravings%2Bgems%2Bcards%2Bcombat-skills%2Barkpassive"));
    }

    @Test
    void cacheHitAvoidsOfficialCallButStillRecordsEachSearch() throws Exception {
        expectProfile("original");
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk());
        time.set(Duration.ofSeconds(59).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName").value("original"));
        verify(searches, times(2)).recordSearch("test-character");
        officialApi.verify();
    }

    @Test
    void temporaryFailureReturnsStaleDataAndRetriesAfterCooldown() throws Exception {
        expectProfile("original");
        expectRequest().andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));
        expectProfile("updated");
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk());
        time.set(Duration.ofSeconds(60).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName").value("original"));
        time.set(Duration.ofSeconds(74).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName").value("original"));
        time.set(Duration.ofSeconds(75).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk())
                .andExpect(jsonPath("$.serverName").value("updated"));
        officialApi.verify();
    }

    @ParameterizedTest
    @CsvSource({"404,404", "401,502", "403,502"})
    void permanentFailureIsNotHiddenByExpiredProfile(int upstreamStatus, int status) throws Exception {
        expectProfile("original");
        expectRequest().andRespond(withStatus(HttpStatus.valueOf(upstreamStatus)));
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk());
        time.set(Duration.ofSeconds(60).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().is(status));
        verify(searches).recordSearch("test-character");
        officialApi.verify();
    }

    @Test
    void dataAtMaximumAgeIsNotReturnedEvenDuringRetryDelay() throws Exception {
        expectProfile("original");
        expectRequest().andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE));
        expectRequest().andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE));
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk());
        time.set(Duration.ofSeconds(599).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isOk());
        time.set(Duration.ofMinutes(10).toNanos());
        mvc.perform(get(PROFILE_URL)).andExpect(status().isBadGateway());
        officialApi.verify();
    }

    private void expectProfile(String server) {
        expectRequest().andRespond(withSuccess("""
                {"CharacterName":"test-character","ServerName":"%s"}
                """.formatted(server), MediaType.APPLICATION_JSON));
    }

    private ResponseActions expectRequest() {
        return officialApi.expect(requestTo("https://official-api.invalid/armories/characters/test-character/profiles"));
    }

    private void assertFailure(int status, String code) throws Exception {
        mvc.perform(get(PROFILE_URL))
                .andExpect(status().is(status))
                .andExpect(jsonPath("$.code").value(code))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(content().string(not(containsString("private-"))));
        verifyNoInteractions(searches);
        officialApi.verify();
    }
}
