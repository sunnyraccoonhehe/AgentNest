package com.agent_nest.server.model.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AiResponse {
    private String reply;
    private List<Map<String, Object>> actions;
}