package com.example.qrcode.service;

import com.example.qrcode.model.Misuse;
import com.example.qrcode.repository.MisuseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MisuseService {
    private final MisuseRepository repo;

    public MisuseService(MisuseRepository repo) {
        this.repo = repo;
    }

    public List<Misuse> findAll() {
        return repo.findAll();
    }

    public List<Misuse> findByUser(String userId) {
        return repo.findAll().stream().filter(m -> m.getUserId().equals(userId)).collect(Collectors.toList());
    }
}

