package com.example.qrcode.service;

import com.example.qrcode.config.AppConfig;
import com.example.qrcode.dto.QrResponse;
import com.example.qrcode.model.TimeLog;
import com.example.qrcode.repository.TimeLogRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
public class QrService {
    private final AppConfig appConfig;
    private final TimeLogRepository repo;

    @Value("${QR_SECRET:}")
    private String qrSecret;

    private Mac hmac;

    public QrService(AppConfig appConfig, TimeLogRepository repo) {
        this.appConfig = appConfig;
        this.repo = repo;
    }

    @PostConstruct
    public void init() throws Exception {
        if (qrSecret == null || qrSecret.isEmpty()) {
            throw new IllegalStateException("QR_SECRET env var must be set");
        }
        SecretKeySpec key = new SecretKeySpec(qrSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmac = Mac.getInstance("HmacSHA256");
        hmac.init(key);
    }

    // Generate payload JSON string
    public String makePayload(String userId, String action) {
        long expiresAt = Instant.now().plus(appConfig.getQrExpiration()).getEpochSecond();
        // simple JSON inline to avoid adding jackson dependency explicitly
        String json = String.format("{\"userId\":\"%s\",\"action\":\"%s\",\"expiresAt\":%d}",
                escape(userId), escape(action), expiresAt);
        return json;
    }

    private String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    public String sign(String payload) {
        byte[] sig = hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(sig);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) sb.append(String.format("%02x", b & 0xff));
        return sb.toString();
    }

    public String toQrDataUrl(String text, int size) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, size, size);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
        String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
        return "data:image/png;base64," + base64;
    }

    public QrResponse createQr(String userId, String action) throws Exception {
        String payload = makePayload(userId, action);
        String signature = sign(payload);
        // encode QR with compact object {payload,signature}
        String qrJson = String.format("{\"payload\":%s,\"signature\":\"%s\"}",
                // payload already JSON string; embed raw
                payload,
                signature);
        String image = toQrDataUrl(qrJson, 300);
        return new QrResponse(payload, signature, image);
    }

    public boolean validateSignature(String payload, String signature) throws Exception {
        byte[] expected = hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        String expectedHex = bytesToHex(expected);
        return constantTimeEquals(expectedHex, signature);
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) result |= a.charAt(i) ^ b.charAt(i);
        return result == 0;
    }

    // parse minimal payload to extract fields without adding JSON library (simple parser)
    public Map<String, String> parsePayload(String payload) {
        // payload like {"userId":"alice","action":"IN","expiresAt":123456}
        String p = payload.trim();
        p = p.substring(1, p.length()-1);
        String[] parts = p.split(",");
        java.util.HashMap<String,String> map = new java.util.HashMap<>();
        for (String part : parts) {
            String[] kv = part.split(":",2);
            if (kv.length<2) continue;
            String k = kv[0].trim();
            String v = kv[1].trim();
            if (k.startsWith("\"") && k.endsWith("\"")) k = k.substring(1,k.length()-1);
            if (v.startsWith("\"") && v.endsWith("\"")) v = v.substring(1,v.length()-1);
            map.put(k, v);
        }
        return map;
    }

    public TimeLog createAndSaveTimeLog(String userId, String action) {
        TimeLog t = new TimeLog(userId, action, Instant.now());
        return repo.save(t);
    }
}

