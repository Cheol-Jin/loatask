package com.example.vuespringlabbackend.lostark.snapshot;

import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.JavaType;
import java.time.*;
import java.util.*;

@Component
public class CharacterSnapshotStore {
    private static final Logger log = LoggerFactory.getLogger(CharacterSnapshotStore.class);
    private final CharacterSnapshotRepository repository;
    private final ObjectMapper json;
    public CharacterSnapshotStore(CharacterSnapshotRepository repository, ObjectMapper json) {
        this.repository = repository;
        this.json = json;
    }
    public <T> SnapshotPersistence<T> binding(String kind, Class<T> type) {
        return binding(kind, json.getTypeFactory().constructType(type));
    }
    public <T> SnapshotPersistence<List<T>> listBinding(String kind, Class<T> type) {
        return binding(kind, json.getTypeFactory().constructCollectionType(List.class, type));
    }
    private <T> SnapshotPersistence<T> binding(String kind, JavaType type) {
        return new SnapshotPersistence<>() {
            public Optional<Saved<T>> read(String name) {
                try {
                    return repository.findById(kind + ":" + name).flatMap(row -> {
                        T value = json.readValue(row.getPayload(), type);
                        return valid(value) ? Optional.of(new Saved<>(value, row.getUpdatedAt().toInstant(ZoneOffset.UTC))) : Optional.empty();
                    });
                } catch (RuntimeException failure) {
                    log.warn("Character snapshot read unavailable");
                    return Optional.empty();
                }
            }
            public void write(String name, T value, Instant updatedAt) {
                try {
                    String payload = json.writeValueAsString(value);
                    if (payload.length() > 2_000_000) return;
                    repository.save(new CharacterSnapshot(kind + ":" + name, payload,
                        LocalDateTime.ofInstant(updatedAt, ZoneOffset.UTC)));
                } catch (RuntimeException failure) {
                    // 저장 실패가 정상 공식 응답을 실패로 바꾸지 않도록 합니다.
                    log.warn("Character snapshot write unavailable");
                }
            }
            public void remove(String name) {
                try { repository.deleteById(kind + ":" + name); }
                catch (RuntimeException failure) { log.warn("Character snapshot removal unavailable"); }
            }
        };
    }
    private boolean valid(Object value) {
        if (value == null) return false;
        if (value instanceof com.example.vuespringlabbackend.lostark.dto.LostArkProfileResponse profile)
            return profile.characterName() != null && !profile.characterName().isBlank();
        if (value instanceof com.example.vuespringlabbackend.lostark.dto.LostArkArmoryResponse armory)
            return valid(armory.profile());
        if (value instanceof List<?> list)
            return list.stream().allMatch(item -> item instanceof com.example.vuespringlabbackend.lostark.dto.LostArkSiblingResponse sibling
                && sibling.characterName() != null && !sibling.characterName().isBlank()
                && sibling.serverName() != null && !sibling.serverName().isBlank());
        return true;
    }
    @Scheduled(initialDelay = 60000, fixedDelay = 3600000)
    public void cleanup() {
        try { repository.deleteOlderThan(LocalDateTime.now(ZoneOffset.UTC).minusDays(7)); }
        catch (RuntimeException failure) { log.warn("Character snapshot cleanup unavailable"); }
    }
}
