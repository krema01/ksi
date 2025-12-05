package com.example.qrcode.service;

import com.example.qrcode.model.Misuse;
import com.example.qrcode.model.TimeLog;
import com.example.qrcode.repository.MisuseRepository;
import com.example.qrcode.repository.TimeLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TimeLogServiceTest {
    private TimeLogRepository repo;
    private MisuseRepository misuseRepo;
    private TimeLogService service;

    @BeforeEach
    public void setup() {
        repo = mock(TimeLogRepository.class);
        misuseRepo = mock(MisuseRepository.class);
        service = new TimeLogService(repo, misuseRepo);
    }

    @Test
    public void createAndSaveTimeLog_callsRepo() {
        when(repo.save(any(TimeLog.class))).thenAnswer(inv -> inv.getArgument(0));
        when(repo.findTopByUserIdOrderByTimestampDesc("u")).thenReturn(Optional.empty());
        TimeLog t = service.createAndSaveTimeLog("u","IN");
        assertEquals("u", t.getUserId());
        assertEquals("IN", t.getAction());
        assertNotNull(t.getTimestamp());
        ArgumentCaptor<TimeLog> cap = ArgumentCaptor.forClass(TimeLog.class);
        verify(repo, times(1)).save(cap.capture());
        assertEquals("u", cap.getValue().getUserId());
        verifyNoInteractions(misuseRepo);
    }

    @Test
    public void createAndSaveTimeLog_detectsMisuse_andSavesMisuseRecord() {
        TimeLog last = new TimeLog("bob","IN", Instant.now());
        when(repo.findTopByUserIdOrderByTimestampDesc("bob")).thenReturn(Optional.of(last));
        when(repo.save(any(TimeLog.class))).thenAnswer(inv -> inv.getArgument(0));
        when(misuseRepo.save(any(Misuse.class))).thenAnswer(inv -> inv.getArgument(0));

        TimeLog t = service.createAndSaveTimeLog("bob","IN");
        assertEquals("bob", t.getUserId());
        // verify misuseRepo.save called
        ArgumentCaptor<Misuse> cap = ArgumentCaptor.forClass(Misuse.class);
        verify(misuseRepo, times(1)).save(cap.capture());
        Misuse saved = cap.getValue();
        assertEquals("bob", saved.getUserId());
        assertTrue(saved.getReason().contains("Consecutive action"));
        verify(repo, times(1)).save(any(TimeLog.class));
    }

    @Test
    public void findAll_delegates() {
        TimeLog t1 = new TimeLog("a","IN", Instant.now());
        when(repo.findAll()).thenReturn(List.of(t1));
        List<TimeLog> all = service.findAll();
        assertEquals(1, all.size());
        assertEquals("a", all.get(0).getUserId());
    }

    @Test
    public void findById_delegates() {
        TimeLog t = new TimeLog("x","OUT", Instant.now());
        when(repo.findById(5L)).thenReturn(Optional.of(t));
        Optional<TimeLog> got = service.findById(5L);
        assertTrue(got.isPresent());
        assertEquals("x", got.get().getUserId());
    }
}
