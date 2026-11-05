package com.example.vuespringlabbackend.lostark.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.util.List;

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
        List<Stat> stats,

        @JsonAlias("Tendencies")
        List<Tendency> tendencies,

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
        String itemMaxLevel,

        @JsonAlias("CombatPower")
        String combatPower
) {
    public record Stat(@JsonAlias("Type") String type, @JsonAlias("Value") String value,
                       @JsonAlias("Tooltip") List<String> tooltip) {}
    public record Tendency(@JsonAlias("Type") String type, @JsonAlias("Point") Integer point,
                           @JsonAlias("MaxPoint") Integer maxPoint) {}
}
