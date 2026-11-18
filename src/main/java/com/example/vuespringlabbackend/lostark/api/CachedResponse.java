package com.example.vuespringlabbackend.lostark.api;

import java.time.Instant;

/** updatedAt은 마지막 공식 API 성공 시각이며 대체 응답으로 연장하지 않습니다. */
public record CachedResponse<T>(T data, Instant updatedAt, boolean stale) {}
