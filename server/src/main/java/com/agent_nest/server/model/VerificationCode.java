// package com.agent_nest.model;

// import jakarta.persistence.*;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "verification_codes")
// @Data
// @NoArgsConstructor
// public class VerificationCode {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(nullable = false)
//     private String email;
    
//     @Column(nullable = false)
//     private String code;
    
//     @Column(nullable = false)
//     private String type;
    
//     @Column(name = "expires_at", nullable = false)
//     private LocalDateTime expiresAt;
    
//     private boolean used = false;
    
//     @Column(name = "created_at")
//     private LocalDateTime createdAt;
    
//     @PrePersist
//     protected void onCreate() {
//         createdAt = LocalDateTime.now();
//     }
// }