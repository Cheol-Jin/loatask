package com.example.vuespringlabbackend.lostark.api;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Locale;

/** 요청 이름을 태그로 쓰지 않고 종류별 고정 크기 집계만 보관합니다. */
@Component
public class CharacterApiMetrics {
    public enum Kind { PROFILE, ARMORY, ROSTER }
    public enum UpstreamResult { SUCCESS, RATE_LIMITED, SERVER_ERROR, HTTP_ERROR, CONNECTION_ERROR, INVALID_RESPONSE }

    private final Instant startedAt = Instant.now();
    private final Counters[] counters = java.util.Arrays.stream(Kind.values())
            .map(kind -> new Counters()).toArray(Counters[]::new);

    private static final class Counters {
        long requests, completed, hits, misses, joined, stale, failures;
        long requestNanos, requestMaxNanos, upstreamCalls, upstreamNanos, upstreamMaxNanos;
        long successes, rateLimited, serverErrors, httpErrors, connectionErrors, invalidResponses;
    }

    public record Snapshot(
            Instant startedAt, long requests, long completed, long cacheHits, long cacheMisses,
            long coalescedRequests, long staleResponses, long failedRequests,
            double hitRatePercent, double requestMeanMs, double requestMaxMs,
            long upstreamCalls, double upstreamMeanMs, double upstreamMaxMs,
            long upstreamSuccesses, long rateLimited, long serverErrors, long httpErrors,
            long connectionErrors, long invalidResponses) {}

    synchronized void requestStarted(Kind kind) { counters[kind.ordinal()].requests++; }
    synchronized void hit(Kind kind) { counters[kind.ordinal()].hits++; }
    synchronized void miss(Kind kind) { counters[kind.ordinal()].misses++; }
    synchronized void joined(Kind kind) { counters[kind.ordinal()].joined++; }

    synchronized void requestFinished(Kind kind, long nanos, boolean stale, boolean failed) {
        var c = counters[kind.ordinal()];
        c.completed++;
        c.requestNanos += Math.max(0, nanos);
        c.requestMaxNanos = Math.max(c.requestMaxNanos, nanos);
        if (stale) c.stale++;
        if (failed) c.failures++;
    }

    synchronized void upstreamFinished(Kind kind, long nanos, UpstreamResult result) {
        var c = counters[kind.ordinal()];
        c.upstreamCalls++;
        c.upstreamNanos += Math.max(0, nanos);
        c.upstreamMaxNanos = Math.max(c.upstreamMaxNanos, nanos);
        switch (result) {
            case SUCCESS -> c.successes++;
            case RATE_LIMITED -> c.rateLimited++;
            case SERVER_ERROR -> c.serverErrors++;
            case HTTP_ERROR -> c.httpErrors++;
            case CONNECTION_ERROR -> c.connectionErrors++;
            case INVALID_RESPONSE -> c.invalidResponses++;
        }
    }

    public synchronized Snapshot snapshot(Kind kind) {
        var c = counters[kind.ordinal()];
        return new Snapshot(startedAt, c.requests, c.completed, c.hits, c.misses, c.joined, c.stale, c.failures,
                c.hits + c.misses == 0 ? 0 : 100.0 * c.hits / (c.hits + c.misses),
                mean(c.requestNanos, c.completed), c.requestMaxNanos / 1_000_000.0,
                c.upstreamCalls, mean(c.upstreamNanos, c.upstreamCalls), c.upstreamMaxNanos / 1_000_000.0,
                c.successes, c.rateLimited, c.serverErrors, c.httpErrors, c.connectionErrors, c.invalidResponses);
    }

    private static double mean(long nanos, long count) {
        return count == 0 ? 0 : nanos / 1_000_000.0 / count;
    }

    public String logLine(Kind kind) {
        var s = snapshot(kind);
        return String.format(Locale.ROOT,
                "CHARACTER_API_METRICS kind=%s startedAt=%s requests=%d completed=%d cacheHits=%d cacheMisses=%d hitRatePercent=%.2f coalesced=%d staleResponses=%d failedRequests=%d requestMeanMs=%.3f requestMaxMs=%.3f upstreamCalls=%d upstreamMeanMs=%.3f upstreamMaxMs=%.3f upstreamSuccesses=%d rateLimited=%d serverErrors=%d httpErrors=%d connectionErrors=%d invalidResponses=%d",
                kind, s.startedAt(), s.requests(), s.completed(), s.cacheHits(), s.cacheMisses(), s.hitRatePercent(),
                s.coalescedRequests(), s.staleResponses(), s.failedRequests(), s.requestMeanMs(), s.requestMaxMs(),
                s.upstreamCalls(), s.upstreamMeanMs(), s.upstreamMaxMs(), s.upstreamSuccesses(), s.rateLimited(),
                s.serverErrors(), s.httpErrors(), s.connectionErrors(), s.invalidResponses());
    }
}
