package com.example.qrcode.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "time_entries")
public class TimeEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "from_time", nullable = false)
    private Instant from;

    @Column(name = "until_time")
    private Instant until;

    public TimeEntry() {}

    public TimeEntry(String userId, Instant from, Instant until) {
        this.userId = userId;
        this.from = from;
        this.until = until;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public Instant getFrom() { return from; }
    public Instant getUntil() { return until; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setFrom(Instant from) { this.from = from; }
    public void setUntil(Instant until) { this.until = until; }
}

