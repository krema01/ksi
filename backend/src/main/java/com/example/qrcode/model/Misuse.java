package com.example.qrcode.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "misuse_records")
public class Misuse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "reason", nullable = false)
    private String reason;

    public Misuse() {}

    public Misuse(String userId, String action, Instant timestamp, String reason) {
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getAction() { return action; }
    public Instant getTimestamp() { return timestamp; }
    public String getReason() { return reason; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setAction(String action) { this.action = action; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public void setReason(String reason) { this.reason = reason; }
}

