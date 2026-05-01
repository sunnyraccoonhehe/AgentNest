package com.agent_nest.server.service;

import com.agent_nest.server.model.dto.EventRequest;
import com.agent_nest.server.model.dto.EventResponse;
import com.agent_nest.server.model.dto.EventUpdateRequest;
import com.agent_nest.server.mapper.EventMapper;
import com.agent_nest.server.model.entity.Event;
import com.agent_nest.server.model.entity.User;
import com.agent_nest.server.repository.EventRepo;
import com.agent_nest.server.repository.UserRepo;
import com.agent_nest.server.util.DateRangeUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepo eventRepo;
    private final UserRepo userRepo;
    private final EventMapper eventMapper;

    @Transactional
    public EventResponse createEvent(Long userId, EventRequest request) {  // ← EventResponse вместо Event
        if (eventRepo.existsOverlappingEvent(userId, request.getStartTime(), request.getEndTime())) {
            throw new RuntimeException("Event overlaps with existing event");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Event event = eventMapper.toEntity(request, user);
        Event savedEvent = eventRepo.save(event);

        return eventMapper.toResponse(savedEvent);
    }


    public List<EventResponse> searchEvents(Long userId, String keyword) {
        List<Event> events = eventRepo.findByUserIdAndTitleContainingIgnoreCaseOrderByStartTimeAsc(userId, keyword);
        return eventMapper.toResponseList(events);
    }

    public EventResponse getEventById(Long eventId, Long userId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return eventMapper.toResponse(event);
    }

    public List<EventResponse> getEventsByCategory(Long userId, Long categoryId) {
        List<Event> events = eventRepo.findEventsByCategory(userId, categoryId);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getAllUserEvents(Long userId) {
        List<Event> events = eventRepo.findByUserIdOrderByStartTimeAsc(userId);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getEventsByDate(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        List<Event> events = eventRepo.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, startOfDay, endOfDay);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getEventsInRange(Long userId, LocalDateTime start, LocalDateTime end) {
        List<Event> events = eventRepo.findEventsInRange(userId, start, end);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getTodayEvents(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        List<Event> events = eventRepo.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, startOfDay, endOfDay);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getWeekEvents(Long userId, LocalDate date) {
        LocalDateTime start = DateRangeUtil.startOfWeek(date);
        LocalDateTime end = DateRangeUtil.endOfWeek(date);
        List<Event> events = eventRepo.findEventsInRange(userId, start, end);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getMonthEvents(Long userId, int year, int month) {
        LocalDateTime startOfMonth = LocalDate.of(year, month, 1).atStartOfDay();

        LocalDateTime endOfMonth = LocalDate.of(year, month, 1)
                .plusMonths(1)
                .atStartOfDay();

        List<Event> events = eventRepo.findEventsInRange(userId, startOfMonth, endOfMonth);
        return eventMapper.toResponseList(events);
    }

    public List<EventResponse> getUpcomingEvents(Long userId, int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(days);
        List<Event> events = eventRepo.findUpcomingEvents(userId, now, future);
        return eventMapper.toResponseList(events);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, Long userId, EventUpdateRequest request) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        eventMapper.updateEntity(event, request);
        Event updatedEvent = eventRepo.save(event);

        return eventMapper.toResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        eventRepo.delete(event);
    }

    @Transactional
    public void deleteAllUserEvents(Long userId) {
        eventRepo.deleteByUserId(userId);
    }

    @Transactional
    public void deleteEventsInRange(Long userId, LocalDateTime start, LocalDateTime end) {
        List<Event> events = eventRepo.findEventsInRange(userId, start, end);
        if (!events.isEmpty()) {
            eventRepo.deleteAll(events);
        }
    }
}