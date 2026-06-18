package com.agent_nest.server.service;

import com.agent_nest.server.model.dto.AiResponse;
import com.agent_nest.server.model.dto.EventRequest;
import com.agent_nest.server.model.dto.EventUpdateRequest;
import com.agent_nest.server.model.entity.ChatMessage;
import com.agent_nest.server.model.entity.Event;
import com.agent_nest.server.model.entity.EventReminder;
import com.agent_nest.server.model.entity.User;
import com.agent_nest.server.repository.ChatMessageRepo;
import com.agent_nest.server.repository.EventReminderRepo;
import com.agent_nest.server.repository.EventRepo;
import com.agent_nest.server.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final EventRepo eventRepo;
    private final EventService eventService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ChatMessageRepo chatMessageRepo;
    private final UserRepository userRepo;
    private final EventReminderRepo reminderRepo;

    // Форматтер без секунд — экономит символы в промпте
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM");

    @Value("${groq.api.key}")
    private String groqApiKey;

    public String chat(Long userId, String userMessage) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        chatMessageRepo.save(ChatMessage.builder()
                .user(user)
                .role("user")
                .content(userMessage)
                .createdAt(LocalDateTime.now())
                .build());

        // Только события от сегодня — не тащим историю прошлого
        LocalDateTime windowStart = LocalDateTime.now().minusHours(1); // +1ч назад на случай текущих событий
        List<Event> events = eventRepo.findByUserIdAndStartTimeAfterOrderByStartTimeAsc(userId, windowStart);

        String systemPrompt = getSystemPrompt(events);

        // Уменьшаем историю с 10 до 6 сообщений
        List<ChatMessage> history = chatMessageRepo.findTop6ByUserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(history);

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        for (ChatMessage msg : history) {
            messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", messages,
                "max_tokens", 600  // снижено с 1200 — ответы ИИ короткие по формату
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    entity,
                    Map.class
            );

            List<Map> choices = (List<Map>) response.getBody().get("choices");
            Map message = (Map) choices.get(0).get("message");
            String content = (String) message.get("content");

            String reply;
            try {
                String cleaned = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
                AiResponse aiResponse = objectMapper.readValue(cleaned, AiResponse.class);
                executeActions(userId, aiResponse.getActions());
                reply = aiResponse.getReply();
            } catch (Exception e) {
                var matcher = java.util.regex.Pattern
                        .compile("\"reply\"\\s*:\\s*\"(.*?)\"", java.util.regex.Pattern.DOTALL)
                        .matcher(content);
                reply = matcher.find() ? matcher.group(1) : content;
            }

            String cleanReply = reply;
            int replyEnd = reply.indexOf("} {");
            if (replyEnd > 0) {
                cleanReply = reply.substring(0, replyEnd).trim();
            }

            chatMessageRepo.save(ChatMessage.builder()
                    .user(user)
                    .role("assistant")
                    .content(cleanReply)
                    .createdAt(LocalDateTime.now())
                    .build());

            return cleanReply;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            if (e.getStatusCode().value() == 429) {
                return "Превышен лимит запросов к ИИ. Попробуй через несколько минут.";
            }
            throw e;
        }
    }

    private void executeActions(Long userId, List<Map<String, Object>> actions) {
        if (actions == null || actions.isEmpty()) return;

        for (Map<String, Object> action : actions) {
            String type = (String) action.get("type");

            switch (type) {
                case "DELETE" -> {
                    Long eventId = Long.valueOf(action.get("eventId").toString());
                    eventService.deleteEvent(eventId, userId);
                }
                case "CREATE" -> {
                    EventRequest request = new EventRequest();
                    request.setTitle((String) action.get("title"));
                    request.setDescription((String) action.getOrDefault("description", ""));
                    request.setStartTime(LocalDateTime.parse((String) action.get("startTime")));
                    request.setEndTime(LocalDateTime.parse((String) action.get("endTime")));
                    eventService.createEvent(userId, request);
                }
                case "UPDATE" -> {}
                case "CREATE_RECURRING" -> {
                    String title = (String) action.get("title");
                    LocalDateTime startTime = LocalDateTime.parse((String) action.get("startTime"));
                    LocalDateTime endTime = LocalDateTime.parse((String) action.get("endTime"));
                    int days = Integer.parseInt(action.get("days").toString());
                    LocalDateTime now = LocalDateTime.now();

                    for (int i = 0; i < days; i++) {
                        LocalDateTime iterStart = startTime.plusDays(i);
                        LocalDateTime iterEnd = endTime.plusDays(i);

                        if (iterEnd.isBefore(now)) continue;

                        EventRequest request = new EventRequest();
                        request.setTitle(title);
                        request.setDescription((String) action.getOrDefault("description", ""));
                        request.setStartTime(iterStart);
                        request.setEndTime(iterEnd);
                        eventService.createEvent(userId, request);
                    }
                }
                case "MOVE" -> {
                    Long eventId = Long.valueOf(action.get("eventId").toString());
                    LocalDateTime newStart = LocalDateTime.parse((String) action.get("startTime"));
                    LocalDateTime newEnd = LocalDateTime.parse((String) action.get("endTime"));

                    Event event = eventRepo.findById(eventId)
                            .orElseThrow(() -> new RuntimeException("Event not found"));

                    if (!event.getUser().getId().equals(userId)) {
                        throw new RuntimeException("Access denied");
                    }

                    EventUpdateRequest request = new EventUpdateRequest();
                    request.setStartTime(newStart);
                    request.setEndTime(newEnd);

                    request.setDescription(event.getDescription());
                    eventService.updateEvent(eventId, userId, request);
                }
                case "CREATE_REMINDER" -> {
                    Long eventId = Long.valueOf(action.get("eventId").toString());
                    int minutesBefore = Integer.parseInt(action.get("minutesBefore").toString());

                    Event event = eventRepo.findById(eventId)
                            .orElseThrow(() -> new RuntimeException("Event not found"));

                    if (!event.getUser().getId().equals(userId)) {
                        throw new RuntimeException("Access denied");
                    }

                    EventReminder reminder = EventReminder.builder()
                            .event(event)
                            .user(event.getUser())
                            .remindAt(event.getStartTime().minusMinutes(minutesBefore))
                            .sent(false)
                            .build();

                    reminderRepo.save(reminder);
                }
            }
        }
    }

    @Nonnull
    private static String getSystemPrompt(List<Event> events) {
        // Компактный список событий: одна строка = одно событие
        StringBuilder eventsContext = new StringBuilder("События:\n");
        for (Event e : events) {
            eventsContext.append(String.format("[%d]%s %s-%s\n",
                    e.getId(),
                    e.getTitle(),
                    e.getStartTime().format(DT_FMT),
                    e.getEndTime().format(DT_FMT)));
        }

        String now = LocalDateTime.now().format(DT_FMT);

        // Промпт сокращён ~в 2.5 раза без потери смысла
        return """
            Планировщик времени. Сейчас: %s
            Отвечай ТОЛЬКО JSON: {"reply":"...","actions":[...]}
            
            Действия:
            DELETE: {"type":"DELETE","eventId":1}
            CREATE: {"type":"CREATE","title":"...","startTime":"2026-06-16T10:00","endTime":"2026-06-16T11:00"}
            RECURRING: {"type":"CREATE_RECURRING","title":"...","startTime":"...","endTime":"...","days":14}
            MOVE: {"type":"MOVE","eventId":1,"startTime":"...","endTime":"..."}
            REMINDER: {"type":"CREATE_REMINDER","eventId":1,"minutesBefore":30}
            
            Правила:
            - startTime всегда >= сейчас; "на весь месяц" = с сегодня до конца месяца
            - MOVE для переноса, не CREATE
            - reply = только текст, без JSON
            - Язык: русский
            - Если время не указано, переспроси про время
            
            """.formatted(now) + eventsContext;
    }

    public List<ChatMessage> getHistory(Long userId) {
        return chatMessageRepo.findTop6ByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ChatMessage> getFullHistory(Long userId) {
        return chatMessageRepo.findByUserIdOrderByCreatedAtAsc(userId);
    }
}