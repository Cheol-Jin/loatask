package com.example.vuespringlabbackend.lostark.search.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "character_search")
public class CharacterSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String characterName;

    @Column(nullable = false)
    private Long searchCount;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public CharacterSearch(String characterName) {
        this.characterName = characterName;
        this.searchCount = 1L;
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseSearchCount() {
        this.searchCount++;
        this.updatedAt = LocalDateTime.now();
    }
}