// package com.agent_nest.server.repository;

// import com.agent_nest.server.model.VerificationCode;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.Optional;

// @Repository
// public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    
//     Optional<VerificationCode> findByEmailAndCodeAndTypeAndUsedFalse(
//         String email, String code, String type
//     );
    
//     @Modifying
//     @Transactional
//     @Query("UPDATE VerificationCode v SET v.used = true WHERE v.email = :email AND v.type = :type")
//     void invalidateOldCodes(String email, String type);
    
//     void deleteByExpiresAtBefore(LocalDateTime now);
// }