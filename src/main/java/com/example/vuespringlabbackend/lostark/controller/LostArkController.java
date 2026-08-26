package com.example.vuespringlabbackend.lostark.controller;

import com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterCreateRequest;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterResponse;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterUpdateRequest;
import com.example.vuespringlabbackend.lostark.service.LostArkCharacterService;
import com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient;
import com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse;
import com.example.vuespringlabbackend.lostark.search.service.CharacterSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterImportRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lostark")
@CrossOrigin(origins = "http://localhost:5173")
public class LostArkController {

    private final LostArkCharacterService characterService;

    private final LostArkOpenApiClient lostArkOpenApiClient;
    
    private final CharacterSearchService characterSearchService;

    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of(
                "game", "Lost Ark",
                "serverStatus", "OK",
                "message", "로스트아크 프로젝트 API가 정상적으로 실행 중입니다."
        );
    }

    @PostMapping("/characters")
    public LostArkCharacterResponse createCharacter(@RequestBody LostArkCharacterCreateRequest request) {
        return characterService.createCharacter(request);
    }

    @GetMapping("/characters")
    public List<LostArkCharacterResponse> getCharacters() {
        return characterService.getCharacters();
    }

    @GetMapping("/characters/{id}")
    public LostArkCharacterResponse getCharacter(@PathVariable Long id) {
        return characterService.getCharacter(id);
    }

    @PutMapping("/characters/{id}")
    public LostArkCharacterResponse updateCharacter(
            @PathVariable Long id,
            @RequestBody LostArkCharacterUpdateRequest request
    ) {
        return characterService.updateCharacter(id, request);
    }

    @DeleteMapping("/characters/{id}")
    public void deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id);
    }

    @GetMapping("/official/characters/{characterName}/profile")
    public LostArkProfileResponse getOfficialCharacterProfile(
    		@PathVariable("characterName") String characterName
    ) {
        LostArkProfileResponse profile =
            lostArkOpenApiClient.getCharacterProfile(characterName);

        if (profile != null && profile.characterName() != null) {
            characterSearchService.recordSearch(profile.characterName());
        }

        return profile;
    }

    @PostMapping("/characters/import")
    public LostArkCharacterResponse importCharacter(@Valid @RequestBody LostArkCharacterImportRequest request) {
        return characterService.importCharacter(request);
    }
}