package com.example.qrcode.repository;

import com.example.qrcode.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    Optional<TimeEntry> findTopByUserIdAndUntilIsNullOrderByFromDesc(String userId);
}

