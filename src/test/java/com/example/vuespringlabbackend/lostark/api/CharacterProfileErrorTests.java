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

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CharacterProfileErrorTests {

    private static final String PROFILE_URL = "/api/lostark/official/characters/test-character/profile";
    private MockRestServiceServer officialApi;
    private MockMvc mvc;
    private CharacterSearchService searches;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://official-api.invalid");
        officialApi = MockRestServiceServer.bindTo(builder).build();
        searches = mock(CharacterSearchService.class);
        LostArkController controller = new LostArkController(mock(LostArkCharacterService.class),
                new LostArkOpenApiClient(builder.build()), searches);
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
