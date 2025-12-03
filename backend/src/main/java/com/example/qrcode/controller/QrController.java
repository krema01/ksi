package com.example.qrcode.controller;

import com.example.qrcode.dto.QrResponse;
import com.example.qrcode.service.QrService;
import com.example.qrcode.repository.TimeLogRepository;
import com.example.qrcode.model.TimeLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QrController {
    private final QrService qrService;
    private final TimeLogRepository timeLogRepository;

    public QrController(QrService qrService, TimeLogRepository timeLogRepository) {
        this.qrService = qrService;
        this.timeLogRepository = timeLogRepository;
    }

    public static class UserRequest { public String userId; }

    @PostMapping("/qrcode/in")
    public ResponseEntity<QrResponse> qrIn(@RequestBody UserRequest req) throws Exception {
        if (req == null || req.userId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(qrService.createQr(req.userId, "IN"));
    }

    @PostMapping("/qrcode/out")
    public ResponseEntity<QrResponse> qrOut(@RequestBody UserRequest req) throws Exception {
        if (req == null || req.userId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(qrService.createQr(req.userId, "OUT"));
    }

    public static class ScanPayload { public String payload; public String signature; }

    @PostMapping("/scan")
    public ResponseEntity<?> scan(@RequestBody ScanPayload body) throws Exception {
        if (body == null || body.payload == null || body.signature == null) return ResponseEntity.badRequest().body("missing");
        boolean ok = qrService.validateSignature(body.payload, body.signature);
        if (!ok) return ResponseEntity.status(400).body("invalid signature");
        Map<String,String> map = qrService.parsePayload(body.payload);
        String expiresAt = map.get("expiresAt");
        if (expiresAt == null) return ResponseEntity.status(400).body("no expiresAt");
        long exp = Long.parseLong(expiresAt);
        if (Instant.now().getEpochSecond() > exp) return ResponseEntity.status(400).body("expired");
        String userId = map.get("userId");
        String action = map.get("action");
        qrService.createAndSaveTimeLog(userId, action);
        return ResponseEntity.ok(Map.of("status","ok"));
    }

    @GetMapping("/timelogs")
    public ResponseEntity<List<TimeLog>> getTimeLogs(@RequestParam String userId) {
        return ResponseEntity.ok(timeLogRepository.findAll().stream()
            .filter(tl -> tl.getUserId().equals(userId))
            .toList());
    }
}
