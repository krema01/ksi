package com.example.qrcode.service;

import com.example.qrcode.model.Misuse;
import com.example.qrcode.model.TimeLog;
import com.example.qrcode.repository.MisuseRepository;
import com.example.qrcode.repository.TimeLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TimeLogService {
    private static final Logger logger = LoggerFactory.getLogger(TimeLogService.class);

    private final TimeLogRepository repo;
    private final MisuseRepository misuseRepo;

    public TimeLogService(TimeLogRepository repo, MisuseRepository misuseRepo) {
        this.repo = repo;
        this.misuseRepo = misuseRepo;
    }

    // New: return a result object containing saved TimeLog and any misuse info
    public TimeLogResult createAndSaveTimeLogWithResult(String userId, String action) {
        boolean misuse = false;
        String reason = null;
        // check last action for this user
        Optional<TimeLog> last = repo.findTopByUserIdOrderByTimestampDesc(userId);
        if (last.isPresent() && last.get().getAction().equals(action)) {
            // misuse detected: same action twice in a row
            misuse = true;
            reason = "Consecutive action without opposite: " + action;
            Misuse m = new Misuse(userId, action, Instant.now(), reason);
            try {
                misuseRepo.save(m);
            } catch (Exception e) {
                logger.warn("Failed to persist misuse record for user {}: {}", userId, e.getMessage());
            }
            logger.warn("Misuse detected for user {} action {}", userId, action);
        }
        TimeLog t = new TimeLog(userId, action, Instant.now());
        TimeLog saved = repo.save(t);
        return new TimeLogResult(saved, misuse, reason);
    }

    // Backwards-compatible helper that returns the saved TimeLog only
    public TimeLog createAndSaveTimeLog(String userId, String action) {
        return createAndSaveTimeLogWithResult(userId, action).getTimeLog();
    }

    public List<TimeLog> findAll() {
        return repo.findAll();
    }

    public Optional<TimeLog> findById(Long id) {
        return repo.findById(id);
    }
}
