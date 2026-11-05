package com.example.vuespringlabbackend.lostark.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/** 공식 통합 전투정보를 화면에서 사용하는 필드만 매핑합니다. */
@JsonIgnoreProperties(ignoreUnknown = true)
public record LostArkArmoryResponse(
        @JsonAlias("ArmoryProfile") LostArkProfileResponse profile,
        @JsonAlias("ArmoryEquipment") List<Equipment> equipment,
        @JsonAlias("ArmoryEngraving") Engravings engravings,
        @JsonAlias("ArmoryGem") Gems gems,
        @JsonAlias("ArmoryCard") Cards cards,
        @JsonAlias("ArmorySkills") List<Skill> skills,
        @JsonAlias("ArkPassive") ArkPassive arkPassive
) {
    public LostArkArmoryResponse {
        equipment = equipment == null ? List.of() : equipment;
        skills = skills == null ? List.of() : skills;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Equipment(
            @JsonAlias("Type") String type, @JsonAlias("Name") String name,
            @JsonAlias("Icon") String icon, @JsonAlias("Grade") String grade,
            @JsonAlias("Tooltip") String tooltip) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Engravings(
            @JsonAlias("Effects") List<EngravingEffect> effects,
            @JsonAlias("ArkPassiveEffects") List<PassiveEngraving> arkPassiveEffects) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record EngravingEffect(
            @JsonAlias("Icon") String icon, @JsonAlias("Name") String name,
            @JsonAlias("Description") String description) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PassiveEngraving(
            @JsonAlias("Name") String name, @JsonAlias("Grade") String grade,
            @JsonAlias("Level") Integer level, @JsonAlias("AbilityStoneLevel") Integer abilityStoneLevel,
            @JsonAlias("Description") String description) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Gems(@JsonAlias("Gems") List<Gem> gems,
                       @JsonAlias("Effects") GemEffects effects) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Gem(
            @JsonAlias("Slot") Integer slot, @JsonAlias("Name") String name,
            @JsonAlias("Icon") String icon, @JsonAlias("Level") Integer level,
            @JsonAlias("Grade") String grade, @JsonAlias("Tooltip") String tooltip) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GemEffects(@JsonAlias("Description") String description,
                             @JsonAlias("Skills") List<GemSkill> skills) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GemSkill(
            @JsonAlias("GemSlot") Integer gemSlot, @JsonAlias("Name") String name,
            @JsonAlias("Description") List<String> description, @JsonAlias("Option") String option) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Cards(@JsonAlias("Cards") List<Card> cards,
                        @JsonAlias("Effects") List<CardEffect> effects) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Card(
            @JsonAlias("Slot") Integer slot, @JsonAlias("Name") String name,
            @JsonAlias("Icon") String icon, @JsonAlias("Grade") String grade,
            @JsonAlias("AwakeCount") Integer awakeCount, @JsonAlias("AwakeTotal") Integer awakeTotal) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CardEffect(@JsonAlias("Items") List<Effect> items) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Effect(@JsonAlias("Name") String name, @JsonAlias("Description") String description) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Skill(
            @JsonAlias("Name") String name, @JsonAlias("Icon") String icon,
            @JsonAlias("Level") Integer level, @JsonAlias("Tooltip") String tooltip,
            @JsonAlias("Tripods") List<Tripod> tripods, @JsonAlias("Rune") Rune rune) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Tripod(@JsonAlias("Tier") Integer tier, @JsonAlias("Name") String name,
                         @JsonAlias("IsSelected") Boolean selected) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Rune(@JsonAlias("Name") String name, @JsonAlias("Grade") String grade) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ArkPassive(
            @JsonAlias("IsArkPassive") Boolean active, @JsonAlias("Title") String title,
            @JsonAlias("Points") List<PassivePoint> points,
            @JsonAlias("Effects") List<Effect> effects) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PassivePoint(@JsonAlias("Name") String name, @JsonAlias("Value") Integer value) {}
}
