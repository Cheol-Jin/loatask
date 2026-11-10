package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse;
import com.example.vuespringlabbackend.lostark.dto.LostArkArmoryResponse;
import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.function.LongSupplier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
public class LostArkOpenApiClient {

    private final RestClient lostArkRestClient;
    private final CharacterResponseCache<LostArkProfileResponse> profiles;
    private final CharacterResponseCache<LostArkArmoryResponse> armories;

    @Autowired
    public LostArkOpenApiClient(RestClient lostArkRestClient) {
        this(lostArkRestClient, System::nanoTime);
    }

    LostArkOpenApiClient(RestClient lostArkRestClient, LongSupplier ticker) {
        this.lostArkRestClient = lostArkRestClient;
        this.profiles = new CharacterResponseCache<>(256, ticker);
        this.armories = new CharacterResponseCache<>(64, ticker);
    }

    public LostArkProfileResponse getCharacterProfile(String characterName) {
        String name = normalize(characterName);
        return profiles.get(name, () -> loadProfile(name));
    }

    private LostArkProfileResponse loadProfile(String characterName) {
        LostArkProfileResponse profile = fetch("/armories/characters/{characterName}/profiles",
                characterName, LostArkProfileResponse.class);
        requireProfile(profile);
        return profile;
    }

    public LostArkArmoryResponse getCharacterArmory(String characterName) {
        String name = normalize(characterName);
        return armories.get(name, () -> loadArmory(name));
    }

    private LostArkArmoryResponse loadArmory(String characterName) {
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

    private String normalize(String characterName) {
        if (characterName == null || characterName.isBlank()) {
            throw new IllegalArgumentException("캐릭터명을 입력해 주세요.");
        }
        return characterName.trim();
    }

    private <T> T fetch(String path, String characterName, Class<T> type, String... filters) {
        try {
            Object[] variables = filters.length == 0
                    ? new Object[]{characterName} : new Object[]{characterName, filters[0]};
            return lostArkRestClient.get().uri(path, variables).retrieve().body(type);
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == 404) {
                throw notFound();
            }
            if (e.getStatusCode().value() == 429) {
                throw new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE,
                        "LOSTARK_RATE_LIMITED", "조회 요청이 많습니다. 잠시 후 다시 검색해 주세요.", true);
            }
            // 외부 API의 원문 오류나 인증정보는 사용자 응답에 포함하지 않습니다.
            throw unavailable(e.getStatusCode().is5xxServerError());
        } catch (ResourceAccessException e) {
            throw new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE,
                    "LOSTARK_CONNECTION_ERROR", "공식 API에 연결하지 못했습니다. 잠시 후 다시 검색해 주세요.", true);
        } catch (RestClientException e) {
            throw unavailable(false);
        }
    }

    private CharacterProfileException notFound() {
        return new CharacterProfileException(HttpStatus.NOT_FOUND,
                "CHARACTER_NOT_FOUND", "캐릭터를 찾을 수 없습니다. 캐릭터명을 확인해 주세요.");
    }

    private CharacterProfileException unavailable(boolean retryable) {
        return new CharacterProfileException(HttpStatus.BAD_GATEWAY,
                "LOSTARK_API_ERROR", "공식 API에서 정보를 가져오지 못했습니다. 잠시 후 다시 검색해 주세요.", retryable);
    }
}
