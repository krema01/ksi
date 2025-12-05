package com.example.qrcode.controller;

import com.example.qrcode.model.Misuse;
import com.example.qrcode.service.MisuseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/misuses")
public class MisuseController {
    private final MisuseService misuseService;

    public MisuseController(MisuseService misuseService) {
        this.misuseService = misuseService;
    }

    @GetMapping
    public ResponseEntity<List<Misuse>> list(@RequestParam(required = false) String userId) {
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.ok(misuseService.findAll());
        }
        return ResponseEntity.ok(misuseService.findByUser(userId));
    }
}

