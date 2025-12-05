package com.example.qrcode.controller;

import com.example.qrcode.model.Misuse;
import com.example.qrcode.service.MisuseService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class MisuseControllerTest {

    static class MisuseServiceStub extends MisuseService {
        public MisuseServiceStub() { super(null); }
        public List<Misuse> list = List.of();
        @Override
        public java.util.List<Misuse> findAll() { return list; }
        @Override
        public java.util.List<Misuse> findByUser(String userId) { return list.stream().filter(m -> m.getUserId().equals(userId)).toList(); }
    }

    @Test
    public void list_all_and_byUser() {
        Misuse m1 = new Misuse("alice","IN", Instant.now(), "reason1");
        Misuse m2 = new Misuse("bob","OUT", Instant.now(), "reason2");
        MisuseServiceStub svc = new MisuseServiceStub();
        svc.list = List.of(m1,m2);
        MisuseController ctrl = new MisuseController(svc);

        ResponseEntity<List<Misuse>> all = ctrl.list(null);
        assertEquals(2, all.getBody().size());

        ResponseEntity<List<Misuse>> bobOnly = ctrl.list("bob");
        assertEquals(1, bobOnly.getBody().size());
        assertEquals("bob", bobOnly.getBody().get(0).getUserId());
    }
}

