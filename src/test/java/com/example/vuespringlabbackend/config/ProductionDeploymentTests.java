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
}
