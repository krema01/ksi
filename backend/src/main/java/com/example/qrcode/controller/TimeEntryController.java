package com.example.qrcode.controller;

import com.example.qrcode.model.TimeEntry;
import com.example.qrcode.repository.TimeEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TimeEntryController {
    private final TimeEntryRepository repo;

    public TimeEntryController(TimeEntryRepository repo) {
        this.repo = repo;
    }

    public static class CreateRequest {
        public String userId;
        public String from;
        public String until;
    }

    @GetMapping("/timeEntries")
    public ResponseEntity<List<TimeEntry>> list(@RequestParam(required = false) String userId) {
        var all = repo.findAll();
        if (userId == null || userId.isBlank())
            return ResponseEntity.ok(all);
        var filtered = all.stream().filter(t -> t.getUserId().equals(userId)).toList();
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/timeEntry")
    public ResponseEntity<TimeEntry> create(@RequestBody CreateRequest req) {
        if (req == null || req.userId == null || req.from == null)
            return ResponseEntity.badRequest().build();
        Instant from;
        Instant until = null;
        try {
            from = Instant.parse(req.from);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        if (req.until != null && !req.until.isBlank()) {
            try {
                until = Instant.parse(req.until);
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        TimeEntry te = new TimeEntry(req.userId, from, until);
        te = repo.save(te);
        return ResponseEntity.ok(te);
    }

    @DeleteMapping("/timeEntry/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id))
            return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/timeEntry/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateRequest req) {
        Optional<TimeEntry> maybe = repo.findById(id);
        if (maybe.isEmpty())
            return ResponseEntity.notFound().build();
        TimeEntry te = maybe.get();
        if (req.userId != null)
            te.setUserId(req.userId);
        if (req.from != null) {
            try {
                te.setFrom(Instant.parse(req.from));
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        if (req.until != null) {
            try {
                te.setUntil(Instant.parse(req.until));
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        repo.save(te);
        return ResponseEntity.ok(te);
    }
}
