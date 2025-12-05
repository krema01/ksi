package com.example.qrcode.repository;

import com.example.qrcode.model.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Long> {
    Optional<QrCode> findBySignature(String signature);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from QrCode q where q.signature = :sig")
    Optional<QrCode> findBySignatureForUpdate(@Param("sig") String sig);
}

