package com.example.qrcode.repository;

import com.example.qrcode.model.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    Optional<TimeLog> findTopByUserIdOrderByTimestampDesc(String userId);
}
