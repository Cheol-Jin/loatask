package com.example.vuespringlabbackend.lostark.dto;

import jakarta.validation.constraints.NotBlank;

//저장요청 dto (/api/lostark/characters/import api서 사용)
public record LostArkCharacterImportRequest(
        @NotBlank(message = "캐릭터명은 필수입니다.")
        String characterName
) {
}
