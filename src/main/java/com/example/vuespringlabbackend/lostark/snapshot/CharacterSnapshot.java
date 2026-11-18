package com.example.vuespringlabbackend.lostark.snapshot;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "character_snapshot")
public class CharacterSnapshot {
    @Id @Column(length = 300)
    private String snapshotKey;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.LONGVARCHAR)
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    protected CharacterSnapshot() {}
    public CharacterSnapshot(String key, String payload, LocalDateTime updatedAt) {
        this.snapshotKey = key;
        this.payload = payload;
        this.updatedAt = updatedAt;
    }
    public String getPayload() { return payload; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
