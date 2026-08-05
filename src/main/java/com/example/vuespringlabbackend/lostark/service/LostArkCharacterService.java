package com.example.vuespringlabbackend.lostark.service;

import com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterCreateRequest;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterResponse;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterUpdateRequest;
import com.example.vuespringlabbackend.lostark.entity.LostArkCharacter;
import com.example.vuespringlabbackend.lostark.repository.LostArkCharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.vuespringlabbackend.lostark.api.LostArkOpenApiClient;
import com.example.vuespringlabbackend.lostark.dto.LostArkCharacterImportRequest;
import com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LostArkCharacterService {

    private final LostArkCharacterRepository characterRepository;

    private final LostArkOpenApiClient lostArkOpenApiClient;

    @Transactional
    public LostArkCharacterResponse createCharacter(LostArkCharacterCreateRequest request) {
        LostArkCharacter character = new LostArkCharacter(
                request.characterName(),
                request.jobName(),
                request.itemLevel()
        );

        LostArkCharacter savedCharacter = characterRepository.save(character);

        return LostArkCharacterResponse.from(savedCharacter);
    }

    @Transactional(readOnly = true)
    public List<LostArkCharacterResponse> getCharacters() {
        return characterRepository.findAllByOrderByItemLevelDesc()
                .stream()
                .map(LostArkCharacterResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LostArkCharacterResponse getCharacter(Long id) {
        LostArkCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캐릭터를 찾을 수 없습니다. id=" + id));

        return LostArkCharacterResponse.from(character);
    }

    @Transactional
    public LostArkCharacterResponse updateCharacter(Long id, LostArkCharacterUpdateRequest request) {
        LostArkCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캐릭터를 찾을 수 없습니다. id=" + id));

        character.update(
                request.characterName(),
                request.jobName(),
                request.itemLevel()
        );

        return LostArkCharacterResponse.from(character);
    }

    @Transactional
    public void deleteCharacter(Long id) {
        LostArkCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캐릭터를 찾을 수 없습니다. id=" + id));

        characterRepository.delete(character);
    }

    @Transactional
    public LostArkCharacterResponse importCharacter(LostArkCharacterImportRequest request) {
        LostArkProfileResponse profile = lostArkOpenApiClient.getCharacterProfile(request.characterName());

        Integer itemLevel = parseItemLevel(profile.itemAvgLevel());

        LostArkCharacter character = characterRepository.findByCharacterName(profile.characterName())
                .map(existingCharacter -> {
                    existingCharacter.updateFromProfile(
                            profile.characterName(),
                            profile.characterClassName(),
                            itemLevel,
                            profile.serverName(),
                            profile.characterImage(),
                            profile.expeditionLevel()
                    );
                    return existingCharacter;
                })
                .orElseGet(() -> characterRepository.save(new LostArkCharacter(
                        profile.characterName(),
                        profile.characterClassName(),
                        itemLevel,
                        profile.serverName(),
                        profile.characterImage(),
                        profile.expeditionLevel()
                )));

        return LostArkCharacterResponse.from(character);
    }

    private Integer parseItemLevel(String itemAvgLevel) {
        if (itemAvgLevel == null) {
            return null;
        }

        String normalizedItemLevel = itemAvgLevel.replace(",", "");

        return (int) Double.parseDouble(normalizedItemLevel);
    }
}