package com.example.vuespringlabbackend.lostark.search.dto;

import com.example.vuespringlabbackend.lostark.search.entity.CharacterSearch;

public record CharacterSearchRankingResponse(
    String characterName,
    Long searchCount
) {

    public static CharacterSearchRankingResponse from(CharacterSearch search) {
        return new CharacterSearchRankingResponse(
            search.getCharacterName(),
            search.getSearchCount()
        );
    }
}