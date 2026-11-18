package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.snapshot.SnapshotPersistence;
import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import org.springframework.http.HttpStatus;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;

class PersistentCharacterCacheTests {
    final Instant base = Instant.parse("2026-11-18T00:00:00Z");
    final AtomicLong time = new AtomicLong();
    final Map<String, SnapshotPersistence.Saved<String>> disk = new HashMap<>();
    final SnapshotPersistence<String> persistence = new SnapshotPersistence<>() {
        public Optional<Saved<String>> read(String key) { return Optional.ofNullable(disk.get(key)); }
        public void write(String key, String value, Instant at) { disk.put(key, new Saved<>(value, at)); }
        public void remove(String key) { disk.remove(key); }
    };
    CharacterResponseCache<String> cache() {
        return new CharacterResponseCache<>(2, time::get, new CharacterApiMetrics(), CharacterApiMetrics.Kind.PROFILE,
            Duration.ofSeconds(60), Duration.ofHours(24), Duration.ofMinutes(1), () -> base.plusNanos(time.get()), persistence);
    }
    CharacterProfileException outage() {
        return new CharacterProfileException(HttpStatus.SERVICE_UNAVAILABLE, "TEMPORARY", "unavailable", true);
    }
    @Test void restartRestoresFourHourOldSnapshotDuringOutageWithoutExtendingTimestamp() {
        cache().get("a", () -> "last success");
        time.set(Duration.ofHours(4).toNanos());
        var restarted = cache();
        var response = restarted.getResponse("a", () -> { throw outage(); });
        assertEquals("last success", response.data());
        assertEquals(base, response.updatedAt());
        assertTrue(response.stale());
        assertEquals(base, disk.get("a").updatedAt());
        assertEquals("last success", restarted.get("a", () -> fail("cooldown should avoid API")));
        time.addAndGet(Duration.ofSeconds(61).toNanos());
        var refreshed = restarted.getResponse("a", () -> "new success");
        assertEquals("new success", refreshed.data());
        assertFalse(refreshed.stale());
        assertEquals(base.plusNanos(time.get()), refreshed.updatedAt());
    }
    @Test void freshDiskSnapshotAvoidsApiAndCacheHitsDoNotRewriteTimestamp() {
        cache().get("a", () -> "saved");
        time.set(Duration.ofSeconds(30).toNanos());
        var result = cache().getResponse("a", () -> fail("fresh snapshot"));
        assertFalse(result.stale());
        assertEquals(base, result.updatedAt());
        assertEquals(base, disk.get("a").updatedAt());
    }
    @Test void expiredAndFutureSnapshotsAreNotServed() {
        for (Instant at : List.of(base.minus(Duration.ofHours(24)), base.plusSeconds(1))) {
            disk.put("a", new SnapshotPersistence.Saved<>("old", at));
            assertThrows(CharacterProfileException.class, () -> cache().get("a", () -> { throw outage(); }));
        }
    }
    @Test void missingCharacterIsNotInventedAnd404RemovesSavedResponse() {
        assertThrows(CharacterProfileException.class, () -> cache().get("unknown", () -> { throw outage(); }));
        disk.put("a", new SnapshotPersistence.Saved<>("saved", base.minusSeconds(61)));
        assertThrows(CharacterProfileException.class, () -> cache().get("a", () -> {
            throw new CharacterProfileException(HttpStatus.NOT_FOUND,"CHARACTER_NOT_FOUND","missing");
        }));
        assertFalse(disk.containsKey("a"));
    }
    @Test void authenticationOrInvalidResponseNeverFallsBackToOldData() {
        disk.put("a", new SnapshotPersistence.Saved<>("saved", base.minusSeconds(61)));
        for (String code : List.of("AUTH_FAILED", "INVALID_RESPONSE")) {
            assertThrows(CharacterProfileException.class, () -> cache().get("a", () -> {
                throw new CharacterProfileException(HttpStatus.BAD_GATEWAY,code,"not retryable",false);
            }));
        }
    }
}
