package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.dto.LostArkNewsResponse.*;
import com.example.vuespringlabbackend.lostark.exception.CharacterProfileException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;

import java.time.Duration;
import java.util.List;
import java.util.function.LongSupplier;

@Component
public class LostArkNewsClient {
    private final RestClient client;
    private final CharacterApiMetrics metrics;
    private final LongSupplier ticker;
    private final CharacterResponseCache<List<Notice>> notices;
    private final CharacterResponseCache<List<Event>> events;

    @Autowired
    public LostArkNewsClient(RestClient client, CharacterApiMetrics metrics) {
        this(client, metrics, System::nanoTime);
    }

    LostArkNewsClient(RestClient client, CharacterApiMetrics metrics, LongSupplier ticker) {
        this.client = client;
        this.metrics = metrics;
        this.ticker = ticker;
        notices = cache(CharacterApiMetrics.Kind.NOTICE);
        events = cache(CharacterApiMetrics.Kind.EVENT);
    }

    private <T> CharacterResponseCache<T> cache(CharacterApiMetrics.Kind kind) {
        return new CharacterResponseCache<>(1, ticker, metrics, kind,
                Duration.ofMinutes(10), Duration.ofHours(1), Duration.ofMinutes(1));
    }

    public List<Notice> notices() {
        return notices.get("notices", () -> List.of(fetch("/news/notices", Notice[].class, CharacterApiMetrics.Kind.NOTICE)));
    }

    public List<Event> events() {
        return events.get("events", () -> List.of(fetch("/news/events", Event[].class, CharacterApiMetrics.Kind.EVENT)));
    }

    private <T> T fetch(String path, Class<T> type, CharacterApiMetrics.Kind kind) {
        long start = ticker.getAsLong();
        var result = CharacterApiMetrics.UpstreamResult.INVALID_RESPONSE;
        try {
            T body = client.get().uri(path).retrieve().body(type);
            if (body == null || java.util.Arrays.stream((Object[]) body).anyMatch(java.util.Objects::isNull)) {
                throw failure(false);
            }
            result = CharacterApiMetrics.UpstreamResult.SUCCESS;
            return body;
        } catch (RestClientResponseException ex) {
            result = ex.getStatusCode().value() == 429 ? CharacterApiMetrics.UpstreamResult.RATE_LIMITED
                    : ex.getStatusCode().is5xxServerError() ? CharacterApiMetrics.UpstreamResult.SERVER_ERROR
                    : CharacterApiMetrics.UpstreamResult.HTTP_ERROR;
            throw failure(ex.getStatusCode().value() == 429 || ex.getStatusCode().is5xxServerError());
        } catch (ResourceAccessException ex) {
            result = CharacterApiMetrics.UpstreamResult.CONNECTION_ERROR;
            throw failure(true);
        } catch (RestClientException ex) {
            throw failure(false);
        } finally {
            metrics.upstreamFinished(kind, ticker.getAsLong() - start, result);
        }
    }

    private CharacterProfileException failure(boolean retryable) {
        return new CharacterProfileException(HttpStatus.BAD_GATEWAY, "NEWS_UNAVAILABLE",
                "공식 소식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", retryable);
    }
}
