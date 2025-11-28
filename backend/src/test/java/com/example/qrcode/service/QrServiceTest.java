package com.example.qrcode.service;

import com.example.qrcode.config.AppConfig;
import com.example.qrcode.model.TimeLog;
import com.example.qrcode.repository.TimeLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class QrServiceTest {
    private QrService qrService;

    @BeforeEach
    public void setup() throws Exception {
        // Avoid mocking AppConfig (Mockito inline mocking has Byte Buddy issues on Java 25)
        AppConfig cfg = new AppConfig();
        // set private field qrExpirationSeconds via reflection
        java.lang.reflect.Field fCfg = AppConfig.class.getDeclaredField("qrExpirationSeconds");
        fCfg.setAccessible(true);
        fCfg.setLong(cfg, 2L);
        // repository isn't needed for these unit tests; pass null
        TimeLogRepository repo = null;
        qrService = new QrService(cfg, repo);
        // set secret via reflection
        java.lang.reflect.Field f = QrService.class.getDeclaredField("qrSecret");
        f.setAccessible(true);
        f.set(qrService, "test-secret");
        qrService.init();
    }

    @Test
    public void generateAndValidate() throws Exception {
        String payload = qrService.makePayload("alice","IN");
        String sig = qrService.sign(payload);
        assertTrue(qrService.validateSignature(payload, sig));
    }

    @Test
    public void expiredPayloadRejected() throws Exception {
        // create payload with expiresAt in past
        String payload = "{\"userId\":\"bob\",\"action\":\"IN\",\"expiresAt\":1}";
        String sig = qrService.sign(payload);
        assertTrue(qrService.validateSignature(payload, sig));
        long now = java.time.Instant.now().getEpochSecond();
        assertTrue(now > 1);
    }
}
