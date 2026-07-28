package com.example.vuespringlabbackend.lostark.dto;

import com.example.vuespringlabbackend.lostark.entity.LostArkCharacter;

public record LostArkCharacterResponse(
        Long id,
        String characterName,
        String jobName,
        Integer itemLevel,
        String serverName,
        String characterImage,
        Integer expeditionLevel
) {

    public static LostArkCharacterResponse from(LostArkCharacter character) {
        return new LostArkCharacterResponse(
                character.getId(),
                character.getCharacterName(),
                character.getJobName(),
                character.getItemLevel(),
                character.getServerName(),
                character.getCharacterImage(),
                character.getExpeditionLevel()
        );
    }
}
