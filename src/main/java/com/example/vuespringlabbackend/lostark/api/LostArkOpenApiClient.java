package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse;
import com.example.vuespringlabbackend.lostark.dto.LostArkArmoryResponse;
import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
@RequiredArgsConstructor
public class LostArkOpenApiClient {

    private final RestClient lostArkRestClient;

    public LostArkProfileResponse getCharacterProfile(String characterName) {
        LostArkProfileResponse profile = fetch("/armories/characters/{characterName}/profiles",
                characterName, LostArkProfileResponse.class);
        requireProfile(profile);
        return profile;
    }

    public LostArkArmoryResponse getCharacterArmory(String characterName) {
        // 필요한 항목을 한 요청으로 조회하여 외부 API 호출 수를 줄입니다.
        LostArkArmoryResponse armory = fetch(
                "/armories/characters/{characterName}?filters={filters}",
                characterName, LostArkArmoryResponse.class,
                "profiles+equipment+engravings+gems+cards+combat-skills+arkpassive");
        requireProfile(armory == null ? null : armory.profile());
        return armory;
    }

    private void requireProfile(LostArkProfileResponse profile) {
        if (profile == null || profile.characterName() == null || profile.characterName().isBlank()) {
            throw notFound();
        }
    }

    private <T> T fetch(String path, String characterName, Class<T> type, String... filters) {
        if (characterName == null || characterName.isBlank()) {
            throw new IllegalArgumentException("캐릭터명을 입력해 주세요.");
        }
        try {
            Object[] variables = filters.length == 0
                    ? new Object[]{characterName.trim()} : new Object[]{characterName.trim(), filters[0]};
            return lostArkRestClient.get().uri(path, variables).retrieve().body(type);
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == 404) {
                throw notFound();
            }
            if (e.getStatusCode().value() == 429) {
                throw new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE,
                        "LOSTARK_RATE_LIMITED", "조회 요청이 많습니다. 잠시 후 다시 검색해 주세요.");
            }
            // 외부 API의 원문 오류나 인증정보는 사용자 응답에 포함하지 않습니다.
            throw unavailable();
        } catch (ResourceAccessException e) {
            throw new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE,
                    "LOSTARK_CONNECTION_ERROR", "공식 API에 연결하지 못했습니다. 잠시 후 다시 검색해 주세요.");
        } catch (RestClientException e) {
            throw unavailable();
        }
    }

    private CharacterProfileException notFound() {
        return new CharacterProfileException(HttpStatus.NOT_FOUND,
                "CHARACTER_NOT_FOUND", "캐릭터를 찾을 수 없습니다. 캐릭터명을 확인해 주세요.");
    }

    private CharacterProfileException unavailable() {
        return new CharacterProfileException(HttpStatus.BAD_GATEWAY,
                "LOSTARK_API_ERROR", "공식 API에서 정보를 가져오지 못했습니다. 잠시 후 다시 검색해 주세요.");
    }
}
