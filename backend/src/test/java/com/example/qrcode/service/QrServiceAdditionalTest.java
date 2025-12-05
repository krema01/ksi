package com.example.qrcode.service;

import com.example.qrcode.config.AppConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class QrServiceAdditionalTest {
    private QrService qrService;

    @BeforeEach
    public void setup() throws Exception {
        AppConfig cfg = new AppConfig();
        // set expiration to 5 seconds for predictable results
        java.lang.reflect.Field fCfg = AppConfig.class.getDeclaredField("qrExpirationSeconds");
        fCfg.setAccessible(true);
        fCfg.setLong(cfg, 5L);
        qrService = new QrService(cfg);
        // set secret and init
        java.lang.reflect.Field f = QrService.class.getDeclaredField("qrSecret");
        f.setAccessible(true);
        f.set(qrService, "another-secret-value");
        qrService.init();
    }

    @Test
    public void testEscapeAndMakePayloadAndParse() {
        String payload = qrService.makePayload("bob\"the\\builder","IN");
        assertTrue(payload.contains("bob\\\"the\\\\builder"));
        Map<String,String> map = qrService.parsePayload(payload);
        assertEquals("IN", map.get("action"));
        assertEquals("bob\"the\\builder", map.get("userId"));
        assertNotNull(map.get("expiresAt"));
    }

    @Test
    public void testSignAndValidateSignature() throws Exception {
        String payload = "{\"userId\":\"x\",\"action\":\"IN\",\"expiresAt\":9999999999}";
        String sig = qrService.sign(payload);
        assertNotNull(sig);
        assertTrue(qrService.validateSignature(payload, sig));
        // mutate signature => validation fails
        assertFalse(qrService.validateSignature(payload, sig.substring(1) + "0"));
    }

    @Test
    public void testToQrDataUrlAndCreateQr() throws Exception {
        String payload = "{\"userId\":\"u\",\"action\":\"IN\",\"expiresAt\":9999999999}";
        String dataUrl = qrService.toQrDataUrl(payload, 100);
        assertNotNull(dataUrl);
        assertTrue(dataUrl.startsWith("data:image/png;base64,"));

        // createQr should produce QrResponse with image dataUrl
        var resp = qrService.createQr("sam","OUT");
        assertNotNull(resp.getPayload());
        assertNotNull(resp.getSignature());
        assertNotNull(resp.getQrImage());
        assertTrue(resp.getQrImage().startsWith("data:image/png;base64,"));
    }
}
