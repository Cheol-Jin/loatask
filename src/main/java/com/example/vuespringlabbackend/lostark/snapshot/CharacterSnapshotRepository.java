package com.example.vuespringlabbackend.lostark.snapshot;

import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

public interface CharacterSnapshotRepository extends JpaRepository<CharacterSnapshot, String> {
    @Modifying @Transactional
    @Query("delete from CharacterSnapshot s where s.updatedAt < :cutoff")
    void deleteOlderThan(LocalDateTime cutoff);
}
