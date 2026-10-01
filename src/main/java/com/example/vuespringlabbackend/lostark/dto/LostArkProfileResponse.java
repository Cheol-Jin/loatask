package com.example.vuespringlabbackend.lostark.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record LostArkProfileResponse(

        @JsonAlias("CharacterImage")
        String characterImage,

        @JsonAlias("ExpeditionLevel")
        Integer expeditionLevel,

        @JsonAlias("PvpGradeName")
        String pvpGradeName,

        @JsonAlias("TownLevel")
        Integer townLevel,

        @JsonAlias("TownName")
        String townName,

        @JsonAlias("Title")
        String title,

        @JsonAlias("GuildMemberGrade")
        String guildMemberGrade,

        @JsonAlias("GuildName")
        String guildName,

        @JsonAlias("UsingSkillPoint")
        Integer usingSkillPoint,

        @JsonAlias("TotalSkillPoint")
        Integer totalSkillPoint,

        @JsonAlias("Stats")
        Object stats,

        @JsonAlias("Tendencies")
        Object tendencies,

        @JsonAlias("ServerName")
        String serverName,

        @JsonAlias("CharacterName")
        String characterName,

        @JsonAlias("CharacterLevel")
        Integer characterLevel,

        @JsonAlias("CharacterClassName")
        String characterClassName,

        @JsonAlias("ItemAvgLevel")
        String itemAvgLevel,

        @JsonAlias("ItemMaxLevel")
        String itemMaxLevel
) {
}
