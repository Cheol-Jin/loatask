package com.example.vuespringlabbackend.lostark.search.repository;

import com.example.vuespringlabbackend.lostark.search.entity.CharacterSearch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterSearchRepository extends JpaRepository<CharacterSearch, Long> {

    Optional<CharacterSearch> findByCharacterName(String characterName);

    List<CharacterSearch> findTop10ByOrderBySearchCountDescUpdatedAtDesc();
}