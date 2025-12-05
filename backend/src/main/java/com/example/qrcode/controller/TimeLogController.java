package com.example.qrcode.controller;

import com.example.qrcode.model.TimeLog;
import com.example.qrcode.service.TimeLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timelogs")
public class TimeLogController {
    private final TimeLogService timeLogService;

    public static class CreateRequest { public String userId; public String action; }

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @GetMapping
    public ResponseEntity<List<TimeLog>> listByUser(@RequestParam String userId) {
        var list = timeLogService.findAll().stream().filter(t -> t.getUserId().equals(userId)).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeLog> getById(@PathVariable Long id) {
        return timeLogService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TimeLog> create(@RequestBody CreateRequest req) {
        if (req == null || req.userId == null || req.action == null) return ResponseEntity.badRequest().build();
        TimeLog tl = timeLogService.createAndSaveTimeLog(req.userId, req.action);
        return ResponseEntity.ok(tl);
    }
}

