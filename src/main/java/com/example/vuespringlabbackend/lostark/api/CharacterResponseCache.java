package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.LongSupplier;
import java.util.function.Supplier;

/** 프로세스 내 개수 제한 캐시. 시간 비교는 시스템 시각 변경에 영향받지 않습니다. */
final class CharacterResponseCache<T> {

    private record Entry<T>(T value, long loadedAt, Long failedAt) {
        boolean usableWithoutRefresh(long now, long freshNanos, long maxAgeNanos, long retryNanos) {
            long age = now - loadedAt;
            return age < freshNanos || (age < maxAgeNanos && failedAt != null && now - failedAt < retryNanos);
        }
    }

    private record Result<T>(T value, boolean stale) {}
    private final CharacterApiMetrics metrics;
    private final CharacterApiMetrics.Kind kind;
    private final long freshNanos, maxAgeNanos, retryNanos;
    private final int capacity;
    private final LongSupplier ticker;
    private final Map<String, Entry<T>> entries = new LinkedHashMap<>(16, 0.75f, true);
    private final Map<String, CompletableFuture<Result<T>>> inFlight = new ConcurrentHashMap<>();

    CharacterResponseCache(int capacity, LongSupplier ticker) {
        this(capacity, ticker, new CharacterApiMetrics(), CharacterApiMetrics.Kind.PROFILE);
    }

    CharacterResponseCache(int capacity, LongSupplier ticker, CharacterApiMetrics metrics, CharacterApiMetrics.Kind kind) {
        this(capacity, ticker, metrics, kind, Duration.ofSeconds(60), Duration.ofMinutes(10), Duration.ofSeconds(15));
    }

    CharacterResponseCache(int capacity, LongSupplier ticker, CharacterApiMetrics metrics, CharacterApiMetrics.Kind kind,
                           Duration fresh, Duration maxAge, Duration retry) {
        this.freshNanos = fresh.toNanos();
        this.maxAgeNanos = maxAge.toNanos();
        this.retryNanos = retry.toNanos();
        this.metrics = metrics;
        this.kind = kind;
        this.capacity = capacity;
        this.ticker = ticker;
    }

    T get(String name, Supplier<T> loader) {
        long start = ticker.getAsLong();
        metrics.requestStarted(kind);
        Result<T> result = null;
        try {
            result = resolve(name, loader);
            return result.value();
        } finally {
            metrics.requestFinished(kind, ticker.getAsLong() - start, result != null && result.stale(), result == null);
        }
    }

    private Result<T> reused(Entry<T> entry) {
        return new Result<>(entry.value(), ticker.getAsLong() - entry.loadedAt() >= freshNanos);
    }

    private Result<T> resolve(String name, Supplier<T> loader) {
        Entry<T> entry = lookup(name);
        if (entry != null && entry.usableWithoutRefresh(ticker.getAsLong(), freshNanos, maxAgeNanos, retryNanos)) {
            metrics.hit(kind);
            return reused(entry);
        }
        metrics.miss(kind);

        var future = new CompletableFuture<Result<T>>();
        var active = inFlight.putIfAbsent(name, future);
        if (active != null) {
            metrics.joined(kind);
            try {
                return active.join();
            } catch (CompletionException ex) {
                if (ex.getCause() instanceof RuntimeException failure) throw failure;
                if (ex.getCause() instanceof Error failure) throw failure;
                throw ex;
            }
        }

        try {
            Result<T> value = refresh(name, loader);
            future.complete(value);
            return value;
        } catch (RuntimeException | Error failure) {
            future.completeExceptionally(failure);
            throw failure;
        } finally {
            inFlight.remove(name, future);
        }
    }

    private Result<T> refresh(String name, Supplier<T> loader) {
        // 앞선 요청이 최초 조회와 병합 등록 사이에 갱신했을 수 있습니다.
        Entry<T> previous = lookup(name);
        if (previous != null && previous.usableWithoutRefresh(ticker.getAsLong(), freshNanos, maxAgeNanos, retryNanos)) return reused(previous);
        try {
            T value = loader.get();
            save(name, new Entry<>(value, ticker.getAsLong(), null));
            return new Result<>(value, false);
        } catch (CharacterProfileException failure) {
            long now = ticker.getAsLong();
            if (failure.isRetryable() && previous != null && now - previous.loadedAt() < maxAgeNanos) {
                save(name, new Entry<>(previous.value(), previous.loadedAt(), now));
                return reused(previous);
            }
            synchronized (entries) {
                entries.remove(name);
            }
            throw failure;
        }
    }

    private Entry<T> lookup(String name) {
        synchronized (entries) {
            Entry<T> entry = entries.get(name);
            if (entry != null && ticker.getAsLong() - entry.loadedAt() >= maxAgeNanos) {
                entries.remove(name);
                return null;
            }
            return entry;
        }
    }

    private void save(String name, Entry<T> entry) {
        synchronized (entries) {
            entries.put(name, entry);
            if (entries.size() > capacity) entries.remove(entries.keySet().iterator().next());
        }
    }
}
