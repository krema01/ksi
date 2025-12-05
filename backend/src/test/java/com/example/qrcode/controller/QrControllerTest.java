package com.example.qrcode.controller;

import com.example.qrcode.dto.QrResponse;
import com.example.qrcode.model.TimeLog;
import com.example.qrcode.service.QrServiceApi;
import com.example.qrcode.service.TimeLogResult;
import com.example.qrcode.service.TimeLogService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;

public class QrControllerTest {

    // Minimal stub implementations used per-test to avoid Mockito/ByteBuddy issues
    static class QrServiceStub implements QrServiceApi {
        public QrResponse createQrReturn;
        public boolean validateReturn = true;
        public Map<String,String> parseReturn;

        @Override
        public String makePayload(String userId, String action) { return null; }
        @Override
        public String sign(String payload) throws Exception { return null; }
        @Override
        public boolean validateSignature(String payload, String signature) throws Exception { return validateReturn; }
        @Override
        public String toQrDataUrl(String text, int size) throws Exception { return null; }
        @Override
        public QrResponse createQr(String userId, String action) throws Exception { return createQrReturn; }
        @Override
        public Map<String, String> parsePayload(String payload) { return parseReturn; }
    }

    static class TimeLogServiceStub extends TimeLogService {
        // simple constructor wiring with null repos is fine for stub, we won't call parent behavior
        public TimeLogServiceStub() { super(null, null); }
        public TimeLogResult toReturn;
        public AtomicBoolean called = new AtomicBoolean(false);
        public String lastUser;
        public String lastAction;

        @Override
        public TimeLogResult createAndSaveTimeLogWithResult(String userId, String action) {
            called.set(true);
            lastUser = userId; lastAction = action;
            return toReturn;
        }
    }

    @Test
    public void qrIn_nullRequest() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        ResponseEntity<?> resp = controller.qrIn(null);
        assertEquals(400, resp.getStatusCodeValue());
    }

    @Test
    public void qrOut_nullRequest() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        ResponseEntity<?> resp = controller.qrOut(null);
        assertEquals(400, resp.getStatusCodeValue());
    }

    @Test
    public void qrIn_success() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrResponse r = new QrResponse("p","s","img");
        qs.createQrReturn = r;
        QrController controller = new QrController(qs, tls);
        QrController.UserRequest req = new QrController.UserRequest();
        req.userId = "u";
        ResponseEntity<QrResponse> resp = controller.qrIn(req);
        assertEquals(200, resp.getStatusCodeValue());
        assertEquals(r, resp.getBody());
    }

    @Test
    public void scan_missingFields() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        ResponseEntity<?> r1 = controller.scan(null);
        assertEquals(400, r1.getStatusCodeValue());

        QrController.ScanPayload sp = new QrController.ScanPayload();
        sp.payload = null; sp.signature = null;
        ResponseEntity<?> r2 = controller.scan(sp);
        assertEquals(400, r2.getStatusCodeValue());
        assertEquals("missing", r2.getBody());
    }

    @Test
    public void scan_invalidSignature() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        qs.validateReturn = false;
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        QrController.ScanPayload sp = new QrController.ScanPayload();
        sp.payload = "p"; sp.signature = "s";
        ResponseEntity<?> r = controller.scan(sp);
        assertEquals(400, r.getStatusCodeValue());
        assertEquals("invalid signature", r.getBody());
    }

    @Test
    public void scan_noExpiresAt() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        qs.validateReturn = true;
        qs.parseReturn = Map.of("userId","a","action","IN");
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        QrController.ScanPayload sp = new QrController.ScanPayload();
        sp.payload = "{" + "\"userId\":\"a\",\"action\":\"IN\"}"; sp.signature = "s";
        ResponseEntity<?> r = controller.scan(sp);
        assertEquals(400, r.getStatusCodeValue());
        assertEquals("no expiresAt", r.getBody());
    }

    @Test
    public void scan_expired() throws Exception {
        QrServiceStub qs = new QrServiceStub();
        qs.validateReturn = true;
        qs.parseReturn = Map.of("userId","a","action","IN","expiresAt","1");
        TimeLogServiceStub tls = new TimeLogServiceStub();
        QrController controller = new QrController(qs, tls);
        QrController.ScanPayload sp = new QrController.ScanPayload();
        sp.payload = "{\"userId\":\"a\",\"action\":\"IN\",\"expiresAt\":1}"; sp.signature = "s";
        ResponseEntity<?> r = controller.scan(sp);
        assertEquals(400, r.getStatusCodeValue());
        assertEquals("expired", r.getBody());
    }

    @Test
    public void scan_success() throws Exception {
        long future = Instant.now().getEpochSecond() + 60;
        QrServiceStub qs = new QrServiceStub();
        qs.validateReturn = true;
        qs.parseReturn = Map.of("userId","john","action","OUT","expiresAt",String.valueOf(future));
        TimeLogServiceStub tls = new TimeLogServiceStub();
        TimeLog tl = new TimeLog("john","OUT", Instant.now());
        tls.toReturn = new TimeLogResult(tl, false, null);
        QrController controller = new QrController(qs, tls);
        QrController.ScanPayload sp = new QrController.ScanPayload();
        sp.payload = String.format("{\"userId\":\"john\",\"action\":\"OUT\",\"expiresAt\":%d}", future);
        sp.signature = "s";
        ResponseEntity<?> r = controller.scan(sp);
        assertEquals(200, r.getStatusCodeValue());
        Map<?,?> body = (Map<?,?>) r.getBody();
        assertEquals("ok", body.get("status"));
        assertEquals(Boolean.FALSE, body.get("misuse"));
        assertTrue(tls.called.get());
        assertEquals("john", tls.lastUser);
    }
}
