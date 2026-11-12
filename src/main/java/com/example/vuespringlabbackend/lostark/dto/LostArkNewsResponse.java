package com.example.vuespringlabbackend.lostark.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public final class LostArkNewsResponse {
    private LostArkNewsResponse() {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Notice(@JsonAlias("Title") String title, @JsonAlias("Date") String date,
                         @JsonAlias("Link") String link, @JsonAlias("Type") String type) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Event(@JsonAlias("Title") String title, @JsonAlias("Thumbnail") String thumbnail,
                        @JsonAlias("Link") String link, @JsonAlias("StartDate") String startDate,
                        @JsonAlias("EndDate") String endDate, @JsonAlias("RewardDate") String rewardDate) {}
}
