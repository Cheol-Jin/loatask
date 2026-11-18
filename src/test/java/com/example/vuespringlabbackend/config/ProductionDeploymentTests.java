package com.example.vuespringlabbackend.config;

import com.example.vuespringlabbackend.lostark.search.repository.CharacterSearchRepository;
import com.example.vuespringlabbackend.lostark.search.service.CharacterSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("prod")
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:deployment-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "lostark.api.key=test-only",
        "app.cors.allowed-origins=https://loatask.vercel.app"
})
class ProductionDeploymentTests {
    @Autowired WebApplicationContext context;
    @Autowired CharacterSearchService searches;
    @Autowired CharacterSearchRepository repository;

    private MockMvc mvc() {
        return MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void productionSchemaSupportsRecordingAndRankingSearches() throws Exception {
        searches.recordSearch("배포검증캐릭터");
        searches.recordSearch("배포검증캐릭터");
        assertEquals(2L, repository.findByCharacterName("배포검증캐릭터").orElseThrow().getSearchCount());
        mvc().perform(get("/api/lostark/search/rankings"))
                .andExpect(status().isOk());
    }

    @Test
    void configuredFrontendCanReadStatus() throws Exception {
        mvc().perform(get("/api/lostark/status").header("Origin", "https://loatask.vercel.app"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://loatask.vercel.app"));
    }

    @Test
    void otherOriginsAreRejected() throws Exception {
        mvc().perform(get("/api/lostark/status").header("Origin", "https://other.invalid"))
                .andExpect(status().isForbidden());
    }

    @Test
    void managementWritesAreBlockedEvenWithoutOriginHeader() throws Exception {
        mvc().perform(post("/api/lostark/characters").contentType("application/json")
                        .content("{\"characterName\":\"test\",\"jobName\":\"test\",\"itemLevel\":1}"))
                .andExpect(status().isForbidden());
        mvc().perform(put("/api/lostark/characters/1").contentType("application/json").content("{}"))
                .andExpect(status().isForbidden());
        mvc().perform(delete("/api/lostark/characters/1"))
                .andExpect(status().isForbidden());
        mvc().perform(post("/api/lostark/characters/import").contentType("application/json").content("{}"))
                .andExpect(status().isForbidden());
    }

    @Autowired com.example.vuespringlabbackend.lostark.snapshot.CharacterSnapshotStore snapshotStore;
    @Autowired com.example.vuespringlabbackend.lostark.snapshot.CharacterSnapshotRepository snapshots;
    @Autowired tools.jackson.databind.ObjectMapper json;

    @Test
    void snapshotSurvivesNewStoreAndSupportsLargeJsonPayload() {
        var at = java.time.Instant.parse("2026-11-18T00:00:00Z");
        String large = "가".repeat(40_000);
        snapshotStore.binding("TEST", String.class).write("large", large, at);
        var restarted = new com.example.vuespringlabbackend.lostark.snapshot.CharacterSnapshotStore(snapshots, json);
        var saved = restarted.binding("TEST", String.class).read("large").orElseThrow();
        assertEquals(large, saved.data());
        assertEquals(at, saved.updatedAt());
    }

    @Test
    void corruptedSnapshotsAreIgnoredAndCleanupOnlyRemovesOldSnapshots() {
        snapshots.save(new com.example.vuespringlabbackend.lostark.snapshot.CharacterSnapshot(
            "TEST:broken", "not-json", java.time.LocalDateTime.now(java.time.ZoneOffset.UTC)));
        org.junit.jupiter.api.Assertions.assertTrue(snapshotStore.binding("TEST", String.class).read("broken").isEmpty());
        snapshotStore.binding("TEST", String.class).write("expired", "old", java.time.Instant.now().minus(java.time.Duration.ofDays(8)));
        snapshotStore.binding("TEST", String.class).write("recent", "new", java.time.Instant.now());
        snapshotStore.cleanup();
        org.junit.jupiter.api.Assertions.assertTrue(snapshotStore.binding("TEST", String.class).read("expired").isEmpty());
        assertEquals("new", snapshotStore.binding("TEST", String.class).read("recent").orElseThrow().data());
    }

    @Test
    void corsExposesDataTimestampHeaders() throws Exception {
        mvc().perform(get("/api/lostark/status").header("Origin", "https://loatask.vercel.app"))
            .andExpect(header().string("Access-Control-Expose-Headers", "X-Lostark-Updated-At, X-Lostark-Stale"));
    }

    @Test
    void restartedClientServesDatabaseSnapshotWithOriginalTimestampDuringOutage() throws Exception {
        var builder = org.springframework.web.client.RestClient.builder().baseUrl("https://official.invalid");
        var official = org.springframework.test.web.client.MockRestServiceServer.bindTo(builder).build();
        official.expect(org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo("https://official.invalid/armories/characters/persisted/profiles"))
            .andRespond(org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess(
                "{\"CharacterName\":\"persisted\",\"ServerName\":\"server\"}", org.springframework.http.MediaType.APPLICATION_JSON));
        var rest = builder.build();
        var client = new com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient(rest,
            new com.example.vuespringlabbackend.lostark.api.CharacterApiMetrics(), snapshotStore);
        client.getCharacterProfile("persisted");
        official.verify();
        official.reset();
        var binding = snapshotStore.binding("PROFILE", com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse.class);
        var at = java.time.Instant.now().minus(java.time.Duration.ofHours(4)).truncatedTo(java.time.temporal.ChronoUnit.MICROS);
        binding.write("persisted", binding.read("persisted").orElseThrow().data(), at);
        official.expect(org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo("https://official.invalid/armories/characters/persisted/profiles"))
            .andRespond(org.springframework.test.web.client.response.MockRestResponseCreators.withServiceUnavailable());
        var restarted = new com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient(rest,
            new com.example.vuespringlabbackend.lostark.api.CharacterApiMetrics(), snapshotStore);
        var controller = new com.example.vuespringlabbackend.lostark.controller.LostArkController(
            org.mockito.Mockito.mock(com.example.vuespringlabbackend.lostark.service.LostArkCharacterService.class), restarted,
            org.mockito.Mockito.mock(com.example.vuespringlabbackend.lostark.search.service.CharacterSearchService.class));
        MockMvcBuilders.standaloneSetup(controller).build()
            .perform(get("/api/lostark/official/characters/persisted/profile"))
            .andExpect(status().isOk())
            .andExpect(header().string("X-Lostark-Stale", "true"))
            .andExpect(header().string("X-Lostark-Updated-At", at.toString()))
            .andExpect(jsonPath("$.characterName").value("persisted"));
        assertEquals(at, binding.read("persisted").orElseThrow().updatedAt());
        official.verify();
    }
}
