package com.agent_nest.server.controller;

import com.agent_nest.server.model.dto.EventRequest;
import com.agent_nest.server.model.dto.EventResponse;
import com.agent_nest.server.model.dto.EventUpdateRequest;
import com.agent_nest.server.model.entity.EventReminder;
import com.agent_nest.server.model.entity.User;
import com.agent_nest.server.repository.EventReminderRepo;
import com.agent_nest.server.service.EventService;
import com.agent_nest.server.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;
    private final EventReminderRepo reminderRepo;
    /**
     * Создать новое событие
     */
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EventRequest request) {
        
        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        EventResponse event = eventService.createEvent(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
    /**
     * Получить событие по ID
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        EventResponse event = eventService.getEventById(eventId, user.getId());
        return ResponseEntity.ok(event);
    }

    /**
     * Получить все события пользователя
     */
    @GetMapping("/user")
    public ResponseEntity<List<EventResponse>> getAllUserEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getAllUserEvents(user.getId());
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события за конкретную дату
     */
    @GetMapping("/date")
    public ResponseEntity<List<EventResponse>> getEventsByDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getEventsByDate(user.getId(), date);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события в диапазоне дат
     */
    @GetMapping("/range")
    public ResponseEntity<List<EventResponse>> getEventsInRange(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);
        List<EventResponse> events = eventService.getEventsInRange(user.getId(), start, end);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на сегодня
     */
    @GetMapping("/today")
    public ResponseEntity<List<EventResponse>> getTodayEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getTodayEvents(user.getId());
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на неделю
     */
    @GetMapping("/week")
    public ResponseEntity<List<EventResponse>> getWeekEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getWeekEvents(user.getId(), date);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на месяц
     */
    @GetMapping("/month")
    public ResponseEntity<List<EventResponse>> getMonthEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year,
            @RequestParam int month) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getMonthEvents(user.getId(), year, month);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить предстоящие события (следующие N дней)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "7") int days) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getUpcomingEvents(user.getId(), days);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события по категории
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<EventResponse>> getEventsByCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long categoryId) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.getEventsByCategory(user.getId(), categoryId);
        return ResponseEntity.ok(events);
    }

    /**
     * Поиск событий по названию
     */
    @GetMapping("/search")
    public ResponseEntity<List<EventResponse>> searchEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String keyword) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        List<EventResponse> events = eventService.searchEvents(user.getId(), keyword);
        return ResponseEntity.ok(events);
    }


    /**
     * Обновить событие
     */
    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId,
            @Valid @RequestBody EventUpdateRequest request) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        EventResponse event = eventService.updateEvent(eventId, user.getId(), request);
        return ResponseEntity.ok(event);
    }


    /**
     * Удалить событие
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long eventId) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        eventService.deleteEvent(eventId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Удалить все события пользователя
     */
    @DeleteMapping("/user/all")
    public ResponseEntity<Void> deleteAllUserEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        eventService.deleteAllUserEvents(user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Удалить события в диапазоне дат
     */
    @DeleteMapping("/range")
    public ResponseEntity<Void> deleteEventsInRange(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        eventService.deleteEventsInRange(user.getId(), start, end);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @GetMapping("/reminders/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingReminders(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername());
        List<EventReminder> reminders = reminderRepo.findByUserIdAndRemindAtBeforeAndSentFalse(
                user.getId(), LocalDateTime.now());

        // помечаем как отправленные
        reminders.forEach(r -> r.setSent(true));
        reminderRepo.saveAll(reminders);

        List<Map<String, Object>> result = reminders.stream()
                .map(r -> Map.<String, Object>of(
                        "title", r.getEvent().getTitle(),
                        "startTime", r.getEvent().getStartTime().toString()
                ))
                .toList();

        return ResponseEntity.ok(result);
    }
}