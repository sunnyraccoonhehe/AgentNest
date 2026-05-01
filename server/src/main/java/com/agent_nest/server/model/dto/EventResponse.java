package com.agent_nest.server.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class EventResponse {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean allDay;
    private String color;
    private String location;
    private boolean recurring;
    private Set<Long> categoryIds;
    private Set<String> categoryNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}