package com.example.qrcode.service;

import com.example.qrcode.dto.QrResponse;

import java.util.Map;

public interface QrServiceApi {
    String makePayload(String userId, String action);
    String sign(String payload) throws Exception;
    boolean validateSignature(String payload, String signature) throws Exception;
    String toQrDataUrl(String text, int size) throws Exception;
    QrResponse createQr(String userId, String action) throws Exception;
    Map<String, String> parsePayload(String payload);
}

