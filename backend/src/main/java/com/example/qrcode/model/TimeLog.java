package com.example.qrcode.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "time_logs")
public class TimeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    public TimeLog() {}

    public TimeLog(String userId, String action, Instant timestamp) {
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getAction() { return action; }
    public Instant getTimestamp() { return timestamp; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setAction(String action) { this.action = action; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

