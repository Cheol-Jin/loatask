package com.example.vuespringlabbackend.lostark.search.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vuespringlabbackend.lostark.search.entity.CharacterSearch;
import com.example.vuespringlabbackend.lostark.search.repository.CharacterSearchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CharacterSearchService {

    private final CharacterSearchRepository characterSearchRepository;

    @Transactional
    public void recordSearch(String characterName) {
        characterSearchRepository.findByCharacterName(characterName)
            .ifPresentOrElse(
                CharacterSearch::increaseSearchCount,
                () -> characterSearchRepository.save(
                    new CharacterSearch(characterName)
                )
            );
    }
}
