package com.example.qrcode.dto;

public class QrResponse {
    private String payload; // base64 or raw JSON string
    private String signature; // hex/base64
    private String qrImage; // data:image/png;base64,...

    public QrResponse() {}

    public QrResponse(String payload, String signature, String qrImage) {
        this.payload = payload;
        this.signature = signature;
        this.qrImage = qrImage;
    }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public String getQrImage() { return qrImage; }
    public void setQrImage(String qrImage) { this.qrImage = qrImage; }
}

