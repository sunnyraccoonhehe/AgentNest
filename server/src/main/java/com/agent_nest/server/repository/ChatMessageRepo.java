package com.agent_nest.server.repository;

import com.agent_nest.server.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepo
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findTop6ByUserIdOrderByCreatedAtDesc(Long userId);

    List<ChatMessage> findByUserIdOrderByCreatedAtAsc(Long userId);
}
