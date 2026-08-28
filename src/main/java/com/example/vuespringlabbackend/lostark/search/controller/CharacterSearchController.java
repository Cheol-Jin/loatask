package com.example.vuespringlabbackend.lostark.search.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vuespringlabbackend.lostark.search.dto.CharacterSearchRankingResponse;
import com.example.vuespringlabbackend.lostark.search.service.CharacterSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lostark/search")
@CrossOrigin(origins = "http://localhost:5173")
public class CharacterSearchController {

    private final CharacterSearchService characterSearchService;

    @GetMapping("/rankings")
    public List<CharacterSearchRankingResponse> getRankings() {
        return characterSearchService.getTop10Rankings();
    }
}