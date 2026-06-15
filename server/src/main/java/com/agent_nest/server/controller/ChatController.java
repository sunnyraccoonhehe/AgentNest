package com.agent_nest.server.controller;

import com.agent_nest.server.model.dto.ChatRequest;
import com.agent_nest.server.model.dto.ChatResponse;
import com.agent_nest.server.model.entity.ChatMessage;
import com.agent_nest.server.repository.ChatMessageRepo;
import com.agent_nest.server.service.ChatService;
import com.agent_nest.server.service.UserService;
import com.agent_nest.server.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatRequest request) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        String reply = chatService.chat(user.getId(), request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        return ResponseEntity.ok(chatService.getFullHistory(user.getId()));
    }

    @GetMapping("/history/full")
    public ResponseEntity<List<ChatMessage>> getFullHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        return ResponseEntity.ok(chatService.getFullHistory(user.getId()));
    }
}