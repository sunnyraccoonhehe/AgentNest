package com.agent_nest.server.service;

import com.agent_nest.server.model.dto.*;
import com.agent_nest.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user: {}", request.getEmail());
        
        if (userService.userExistsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with this email");
        }
        
        String username = request.getUsername() != null ? request.getUsername() : request.getEmail().split("@")[0];
        
        userService.createUser(
            request.getEmail(), 
            request.getPhone(), 
            request.getPassword(), 
            username
        );
        
        String token = jwtUtil.generateToken(request.getEmail());
        
        return AuthResponse.builder()
            .token(token)
            .email(request.getEmail())
            .username(username)
            .verified(true)
            .build();
    }
    
    @Transactional
    public AuthResponse login(AuthRequest request) {
        log.info("Logging in user: {}", request.getEmail());
        
        var user = userService.authenticate(request.getEmail(), request.getPassword());
        
        String token = jwtUtil.generateToken(request.getEmail());
        
        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .username(user.getUsername())
            .verified(true)
            .build();
    }
    
    @Transactional
    public AuthResponse updateProfile(String email, ProfileRequest request) {
        userService.updateProfile(email, request.getUsername());
        
        String token = jwtUtil.generateToken(email);
        
        return AuthResponse.builder()
            .token(token)
            .email(email)
            .username(request.getUsername())
            .verified(true)
            .build();
    }

    public UserResponse getCurrentUser(String email) {
        return userService.getUserByEmail(email);
    }
}