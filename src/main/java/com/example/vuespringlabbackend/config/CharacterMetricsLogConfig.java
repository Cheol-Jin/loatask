package com.example.vuespringlabbackend.config;

import com.example.vuespringlabbackend.lostark.api.CharacterApiMetrics;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class CharacterMetricsLogConfig {
    private static final Logger log = LoggerFactory.getLogger(CharacterMetricsLogConfig.class);
    private final CharacterApiMetrics metrics;

    @Scheduled(initialDelay = 60000, fixedDelay = 60000)
    public void logMetrics() {
        for (var kind : CharacterApiMetrics.Kind.values()) log.info(metrics.logLine(kind));
    }
}
