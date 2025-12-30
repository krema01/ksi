package com.example.qrcode.controller;

import com.example.qrcode.model.QrCode;
import com.example.qrcode.model.TimeEntry;
import com.example.qrcode.repository.QrCodeRepository;
import com.example.qrcode.repository.TimeEntryRepository;
import com.example.qrcode.service.QrServiceApi;
import com.example.qrcode.dto.QrResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
public class CheckController {
    private final QrServiceApi qrService;
    private final QrCodeRepository qrCodeRepository;
    private final TimeEntryRepository timeEntryRepository;

    public CheckController(QrServiceApi qrService, QrCodeRepository qrCodeRepository, TimeEntryRepository timeEntryRepository) {
        this.qrService = qrService;
        this.qrCodeRepository = qrCodeRepository;
        this.timeEntryRepository = timeEntryRepository;
    }

    // returns just the signature/uuid used by client
    @GetMapping("/api/qrCode")
    public ResponseEntity<Map<String,String>> getQr(@RequestParam String userId, @RequestParam String action) throws Exception {
        QrResponse resp = qrService.createQr(userId, action);
        return ResponseEntity.ok(Map.of("qrCodeUUID", resp.getSignature()));
    }

    // payload: {"userId":"...","qrCodeUUID":"..."}
    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(@RequestBody Map<String,String> body) {
        if (body == null) return ResponseEntity.badRequest().build();
        String userId = body.get("userId");
        String qr = body.get("qrCodeUUID");
        if (userId == null || qr == null) return ResponseEntity.badRequest().build();

        if (qrCodeRepository != null) {
            Optional<QrCode> maybe = qrCodeRepository.findBySignature(qr);
            if (maybe.isEmpty()) return ResponseEntity.status(400).body("unknown qr");
        }

        TimeEntry te = new TimeEntry(userId, Instant.now(), null);
        timeEntryRepository.save(te);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String,String> body) {
        if (body == null) return ResponseEntity.badRequest().build();
        String userId = body.get("userId");
        String qr = body.get("qrCodeUUID");
        if (userId == null || qr == null) return ResponseEntity.badRequest().build();

        if (qrCodeRepository != null) {
            Optional<QrCode> maybe = qrCodeRepository.findBySignature(qr);
            if (maybe.isEmpty()) return ResponseEntity.status(400).body("unknown qr");
        }

        Optional<TimeEntry> open = timeEntryRepository.findTopByUserIdAndUntilIsNullOrderByFromDesc(userId);
        if (open.isEmpty()) return ResponseEntity.status(400).body("no open entry");
        TimeEntry te = open.get();
        te.setUntil(Instant.now());
        timeEntryRepository.save(te);
        return ResponseEntity.ok().build();
    }
}

