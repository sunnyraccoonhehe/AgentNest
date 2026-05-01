package com.agent_nest.server.controller;

import com.agent_nest.server.model.dto.EventRequest;
import com.agent_nest.server.model.dto.EventResponse;
import com.agent_nest.server.model.dto.EventUpdateRequest;
import com.agent_nest.server.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    /**
     * Создать новое событие
     */
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody EventRequest request) {

        EventResponse event = eventService.createEvent(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    /**
     * Получить событие по ID
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long eventId) {

        EventResponse event = eventService.getEventById(eventId, userId);
        return ResponseEntity.ok(event);
    }

    /**
     * Получить все события пользователя
     */
    @GetMapping("/user")
    public ResponseEntity<List<EventResponse>> getAllUserEvents(
            @RequestHeader("X-User-Id") Long userId) {

        List<EventResponse> events = eventService.getAllUserEvents(userId);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события за конкретную дату
     */
    @GetMapping("/date")
    public ResponseEntity<List<EventResponse>> getEventsByDate(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<EventResponse> events = eventService.getEventsByDate(userId, date);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события в диапазоне дат
     */
    @GetMapping("/range")
    public ResponseEntity<List<EventResponse>> getEventsInRange(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<EventResponse> events = eventService.getEventsInRange(userId, start, end);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на сегодня
     */
    @GetMapping("/today")
    public ResponseEntity<List<EventResponse>> getTodayEvents(
            @RequestHeader("X-User-Id") Long userId) {

        List<EventResponse> events = eventService.getTodayEvents(userId);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на неделю
     */
    @GetMapping("/week")
    public ResponseEntity<List<EventResponse>> getWeekEvents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<EventResponse> events = eventService.getWeekEvents(userId, date);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события на месяц
     */
    @GetMapping("/month")
    public ResponseEntity<List<EventResponse>> getMonthEvents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam int year,
            @RequestParam int month) {

        List<EventResponse> events = eventService.getMonthEvents(userId, year, month);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить предстоящие события (следующие N дней)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "7") int days) {

        List<EventResponse> events = eventService.getUpcomingEvents(userId, days);
        return ResponseEntity.ok(events);
    }

    /**
     * Получить события по категории
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<EventResponse>> getEventsByCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long categoryId) {

        List<EventResponse> events = eventService.getEventsByCategory(userId, categoryId);
        return ResponseEntity.ok(events);
    }

    /**
     * Поиск событий по названию
     */
    @GetMapping("/search")
    public ResponseEntity<List<EventResponse>> searchEvents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String keyword) {

        List<EventResponse> events = eventService.searchEvents(userId, keyword);
        return ResponseEntity.ok(events);
    }


    /**
     * Обновить событие
     */
    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long eventId,
            @Valid @RequestBody EventUpdateRequest request) {

        EventResponse event = eventService.updateEvent(eventId, userId, request);
        return ResponseEntity.ok(event);
    }


    /**
     * Удалить событие
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long eventId) {

        eventService.deleteEvent(eventId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Удалить все события пользователя
     */
    @DeleteMapping("/user/all")
    public ResponseEntity<Void> deleteAllUserEvents(
            @RequestHeader("X-User-Id") Long userId) {

        eventService.deleteAllUserEvents(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Удалить события в диапазоне дат
     */
    @DeleteMapping("/range")
    public ResponseEntity<Void> deleteEventsInRange(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        eventService.deleteEventsInRange(userId, start, end);
        return ResponseEntity.noContent().build();
    }
}