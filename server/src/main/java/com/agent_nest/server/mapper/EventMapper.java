package com.agent_nest.server.mapper;  // Обратите внимание: должен быть в пакете mapper, не entity!

import com.agent_nest.server.model.dto.EventRequest;
import com.agent_nest.server.model.dto.EventResponse;
import com.agent_nest.server.model.dto.EventUpdateRequest;
import com.agent_nest.server.model.entity.Category;
import com.agent_nest.server.model.entity.Event;
import com.agent_nest.server.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EventMapper {

    /**
     * Преобразование EventRequest в Entity Event
     */
    public Event toEntity(EventRequest request, User user) {
        if (request == null) {
            return null;
        }

        Event event = new Event();
        event.setUser(user);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setAllDay(request.isAllDay());
        event.setColor(request.getColor());
        event.setLocation(request.getLocation());
        event.setRecurring(request.isRecurring());

        return event;
    }

    /**
     * Преобразование EventUpdateRequest в Entity Event (для обновления)
     */
    public void updateEntity(Event existingEvent, EventUpdateRequest request) {
        if (request == null) {
            return;
        }

        if (request.getTitle() != null) {
            existingEvent.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            existingEvent.setDescription(request.getDescription());
        }
        if (request.getStartTime() != null) {
            existingEvent.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            existingEvent.setEndTime(request.getEndTime());
        }
        if (request.getAllDay() != null) {
            existingEvent.setAllDay(request.getAllDay());
        }
        if (request.getColor() != null) {
            existingEvent.setColor(request.getColor());
        }
        if (request.getLocation() != null) {
            existingEvent.setLocation(request.getLocation());
        }
        if (request.getRecurring() != null) {
            existingEvent.setRecurring(request.getRecurring());
        }
    }

    /**
     * Преобразование Entity Event в EventResponse DTO
     */
    public EventResponse toResponse(Event event) {
        if (event == null) {
            return null;
        }

        return EventResponse.builder()
                .id(event.getId())
                .userId(event.getUser() != null ? event.getUser().getId() : null)
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .allDay(event.isAllDay())
                .color(event.getColor())
                .location(event.getLocation())
                .recurring(event.isRecurring())
                .categoryIds(getCategoryIds(event.getCategories()))
                .categoryNames(getCategoryNames(event.getCategories()))
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    /**
     * Преобразование списка Entity в список Response DTO
     */
    public List<EventResponse> toResponseList(List<Event> events) {
        if (events == null) {
            return List.of();
        }

        return events.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Получить ID категорий из сета категорий
     */
    private Set<Long> getCategoryIds(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return Set.of();
        }

        return categories.stream()
                .map(Category::getId)
                .collect(Collectors.toSet());
    }

    /**
     * Получить названия категорий из сета категорий
     */
    private Set<String> getCategoryNames(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return Set.of();
        }

        return categories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
    }
}