package com.example.vuespringlabbackend.lostark.dto;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.*;

class LostArkProfileResponseTests {

    private final JsonMapper mapper = JsonMapper.builder().build();

    @Test
    void readsOfficialApiFieldsAndWritesFrontendFields() {
        String officialResponse = """
                {
                  "CharacterName": "테스트캐릭터",
                  "CharacterImage": "https://example.com/character.png",
                  "ServerName": "테스트서버",
                  "CharacterClassName": "소서리스",
                  "CharacterLevel": 70,
                  "ExpeditionLevel": 200,
                  "ItemAvgLevel": "1,700.00",
                  "ItemMaxLevel": "1,700.00",
                  "GuildName": "테스트길드",
                  "TownName": "테스트영지"
                }
                """;

        LostArkProfileResponse profile = mapper.readValue(officialResponse, LostArkProfileResponse.class);
        var response = mapper.readTree(mapper.writeValueAsString(profile));

        assertAll(
                () -> assertEquals("테스트캐릭터", profile.characterName()),
                () -> assertEquals("테스트캐릭터", response.path("characterName").asText()),
                () -> assertEquals("https://example.com/character.png", response.path("characterImage").asText()),
                () -> assertEquals("테스트서버", response.path("serverName").asText()),
                () -> assertEquals("소서리스", response.path("characterClassName").asText()),
                () -> assertEquals(70, response.path("characterLevel").asInt()),
                () -> assertEquals(200, response.path("expeditionLevel").asInt()),
                () -> assertEquals("1,700.00", response.path("itemAvgLevel").asText()),
                () -> assertEquals("1,700.00", response.path("itemMaxLevel").asText()),
                () -> assertEquals("테스트길드", response.path("guildName").asText()),
                () -> assertEquals("테스트영지", response.path("townName").asText()),
                () -> assertFalse(response.has("CharacterName"))
        );
    }
}
