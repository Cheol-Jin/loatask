package com.example.vuespringlabbackend.lostark.repository;

import com.example.vuespringlabbackend.lostark.entity.LostArkCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LostArkCharacterRepository extends JpaRepository<LostArkCharacter, Long> {

    Optional<LostArkCharacter> findByCharacterName(String characterName);

    List<LostArkCharacter> findAllByOrderByItemLevelDesc();
}
