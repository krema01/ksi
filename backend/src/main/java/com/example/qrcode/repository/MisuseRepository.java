package com.example.qrcode.repository;

import com.example.qrcode.model.Misuse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MisuseRepository extends JpaRepository<Misuse, Long> {
}

