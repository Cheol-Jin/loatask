package com.example.vuespringlabbackend.lostark.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LostArkSiblingResponse(
        @JsonAlias("ServerName") String serverName,
        @JsonAlias("CharacterName") String characterName,
        @JsonAlias("CharacterLevel") Integer characterLevel,
        @JsonAlias("CharacterClassName") String characterClassName,
        @JsonAlias("ItemAvgLevel") String itemAvgLevel
) {}
