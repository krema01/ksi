package com.example.qrcode.controller;

import com.example.qrcode.model.User;
import com.example.qrcode.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserRepository userRepository;

    // simple in-memory session store token->userId
    private static final ConcurrentHashMap<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req == null || req.username == null || req.password == null)
            return ResponseEntity.badRequest().build();
        Optional<User> maybe = userRepository.findByUsername(req.username);
        if (maybe.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        User u = maybe.get();
        if (!u.getPassword().equals(req.password))
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        String token = UUID.randomUUID().toString();
        sessions.put(token, u.getId());
        // return expected fields plus token for convenience
        return ResponseEntity.ok(Map.of(
                "username", u.getUsername(),
                "id", u.getId(),
                "role", u.getRole(),
                "token", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody(required = false) Map<String, String> body) {
        String token = null;
        if (auth != null && auth.startsWith("Bearer "))
            token = auth.substring(7);
        if (token == null && body != null)
            token = body.get("token");
        if (token != null)
            sessions.remove(token);
        return ResponseEntity.ok().build();
    }

    // helper used by other controllers to resolve current user from token (not
    // strictly used everywhere)
    public static Long resolveUserIdFromToken(String token) {
        if (token == null)
            return null;
        return sessions.get(token);
    }
}
