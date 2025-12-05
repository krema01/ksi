package com.example.qrcode.service;

import com.example.qrcode.model.TimeLog;

public class TimeLogResult {
    private final TimeLog timeLog;
    private final boolean misuse;
    private final String reason;

    public TimeLogResult(TimeLog timeLog, boolean misuse, String reason) {
        this.timeLog = timeLog;
        this.misuse = misuse;
        this.reason = reason;
    }

    public TimeLog getTimeLog() { return timeLog; }
    public boolean isMisuse() { return misuse; }
    public String getReason() { return reason; }
}

