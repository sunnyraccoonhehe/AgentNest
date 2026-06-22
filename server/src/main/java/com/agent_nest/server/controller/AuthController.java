package com.agent_nest.server.controller;

import com.agent_nest.server.model.dto.*;
import java.util.Map;

import com.agent_nest.server.security.JwtUtil;
import com.agent_nest.server.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ProfileRequest request
    ) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(authService.updateProfile(email, request));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok().body(Map.of("status", "OK", "message", "Server is running"));
    }
}