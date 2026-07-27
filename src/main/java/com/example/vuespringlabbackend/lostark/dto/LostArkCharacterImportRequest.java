package com.example.vuespringlabbackend.lostark.dto;

//저장요청 dto (/api/lostark/characters/import api서 사용)
public record LostArkCharacterImportRequest(
        String characterName
) {
}
