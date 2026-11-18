package com.example.vuespringlabbackend.lostark.snapshot;

import java.time.Instant;
import java.util.Optional;

public interface SnapshotPersistence<T> {
    record Saved<T>(T data, Instant updatedAt) {}
    Optional<Saved<T>> read(String name);
    void write(String name, T value, Instant updatedAt);
    void remove(String name);
}
