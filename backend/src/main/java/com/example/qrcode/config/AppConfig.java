package com.example.qrcode.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class AppConfig {
    @Value("${QR_EXPIRATION_SECONDS:300}")
    private long qrExpirationSeconds;

    public Duration getQrExpiration() {
        return Duration.ofSeconds(qrExpirationSeconds);
    }
}

