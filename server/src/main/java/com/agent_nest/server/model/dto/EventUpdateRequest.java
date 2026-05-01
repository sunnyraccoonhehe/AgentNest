package com.agent_nest.server.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class EventUpdateRequest {

    private String title;

    private String description;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean allDay;

    private String color;

    private String location;

    private Boolean recurring;

    private Set<Long> categoryIds;
}