package com.example.qrcode.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "qr_codes")
public class QrCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "signature", nullable = false, unique = true)
    private String signature;

    @Column(name = "payload", nullable = false, columnDefinition = "text")
    private String payload;

    @Column(name = "used", nullable = false)
    private boolean used = false;

    @Column(name = "used_at")
    private Instant usedAt;

    public QrCode() {}

    public QrCode(String signature, String payload) {
        this.signature = signature;
        this.payload = payload;
        this.used = false;
    }

    public Long getId() { return id; }
    public String getSignature() { return signature; }
    public String getPayload() { return payload; }
    public boolean isUsed() { return used; }
    public Instant getUsedAt() { return usedAt; }

    public void setId(Long id) { this.id = id; }
    public void setSignature(String signature) { this.signature = signature; }
    public void setPayload(String payload) { this.payload = payload; }
    public void setUsed(boolean used) { this.used = used; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
}

