package com.example.vuespringlabbackend.lostark.api;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class CharacterResponseCacheTests {
    @Test
    void evictsLeastRecentlyUsedResponseAtCapacity() {
        var cache = new CharacterResponseCache<String>(2, () -> 0L);
        cache.get("a", () -> "a");
        cache.get("b", () -> "old b");
        cache.get("a", () -> fail("a should be cached"));
        cache.get("c", () -> "c");
        assertEquals("new b", cache.get("b", () -> "new b"));
    }

    @Test
    void concurrentLookupsShareOneLoadWithoutBlockingOtherNames() throws Exception {
        var metrics = new CharacterApiMetrics();
        var cache = new CharacterResponseCache<String>(2, () -> 0L, metrics, CharacterApiMetrics.Kind.PROFILE);
        var pool = Executors.newFixedThreadPool(3);
        var entered = new CountDownLatch(1);
        var release = new CountDownLatch(1);
        var started = new CountDownLatch(1);
        var loads = new AtomicInteger();
        try {
            var first = pool.submit(() -> cache.get("a", () -> {
                loads.incrementAndGet();
                entered.countDown();
                try {
                    assertTrue(release.await(5, TimeUnit.SECONDS));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new AssertionError(e);
                }
                return "shared";
            }));
            assertTrue(entered.await(5, TimeUnit.SECONDS));
            var second = pool.submit(() -> {
                started.countDown();
                return cache.get("a", () -> {
                    loads.incrementAndGet();
                    return "unexpected";
                });
            });
            assertTrue(started.await(5, TimeUnit.SECONDS));
            assertEquals("other", pool.submit(() -> cache.get("b", () -> "other")).get(5, TimeUnit.SECONDS));
            release.countDown();
            assertEquals("shared", first.get(5, TimeUnit.SECONDS));
            assertEquals("shared", second.get(5, TimeUnit.SECONDS));
            assertEquals(1, loads.get());
            var snapshot = metrics.snapshot(CharacterApiMetrics.Kind.PROFILE);
            assertEquals(3, snapshot.requests());
            assertEquals(3, snapshot.completed());
            assertEquals(0, snapshot.failedRequests());
            assertEquals(snapshot.requests(), snapshot.cacheHits() + snapshot.cacheMisses());
            // 두 번째 스레드 실행 시점에 따라 병합 또는 이미 완료된 캐시 적중입니다.
            assertEquals(1, snapshot.coalescedRequests() + snapshot.cacheHits());
        } finally {
            release.countDown();
            pool.shutdownNow();
        }
    }
}
