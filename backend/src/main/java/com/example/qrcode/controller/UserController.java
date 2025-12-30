package com.example.qrcode.controller;

import com.example.qrcode.dto.UserDto;
import com.example.qrcode.model.User;
import com.example.qrcode.repository.UserRepository;
import com.example.qrcode.repository.TimeEntryRepository;
import com.example.qrcode.model.TimeEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserRepository userRepository;
    private final TimeEntryRepository timeEntryRepository;

    public UserController(UserRepository userRepository, TimeEntryRepository timeEntryRepository) {
        this.userRepository = userRepository;
        this.timeEntryRepository = timeEntryRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> listUsers() {
        var users = userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getUsername(), u.getRole(), u.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    public static class CreateUserRequest { public String username; public String password; public String role; public String name; }

    @PostMapping("/user")
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest req) {
        if (req == null || req.username == null || req.password == null || req.role == null) return ResponseEntity.badRequest().build();
        User u = new User(req.username, req.password, req.role, req.name);
        u = userRepository.save(u);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getRole(), u.getName()));
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public static class UpdateUserRequest { public String name; public String role; }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        Optional<User> maybe = userRepository.findById(id);
        if (maybe.isEmpty()) return ResponseEntity.notFound().build();
        User u = maybe.get();
        if (req.name != null) u.setName(req.name);
        if (req.role != null) u.setRole(req.role);
        userRepository.save(u);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getRole(), u.getName()));
    }

    // returns all timeEntries from a user
    @GetMapping("/user/timeEntries")
    public ResponseEntity<List<TimeEntry>> timeEntries(@RequestParam Long userId) {
        // Compare by string representation to avoid primitive/boxed mismatch
        String uid = String.valueOf(userId);
        List<TimeEntry> entries = timeEntryRepository.findAll().stream()
                .filter(te -> te.getUserId() != null && te.getUserId().equals(uid))
                .collect(Collectors.toList());
        return ResponseEntity.ok(entries);
    }
}
