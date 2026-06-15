package com.agent_nest.server.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DateRangeUtil {

    /**
     * Получить начало дня
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        return date.atStartOfDay();
    }

    /**
     * Получить конец дня
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        return date.atTime(LocalTime.MAX);
    }

    /**
     * Получить начало недели (понедельник)
     */
    public static LocalDateTime startOfWeek(LocalDate date) {
        return date.with(java.time.DayOfWeek.MONDAY).atStartOfDay();
    }

    /**
     * Получить конец недели (воскресенье)
     */
    public static LocalDateTime endOfWeek(LocalDate date) {
        return date.with(java.time.DayOfWeek.SUNDAY).atTime(LocalTime.MAX);
    }

    /**
     * Получить начало месяца
     */
    public static LocalDateTime startOfMonth(LocalDate date) {
        return date.withDayOfMonth(1).atStartOfDay();
    }

    /**
     * Получить конец месяца
     */
    public static LocalDateTime endOfMonth(LocalDate date) {
        return date.withDayOfMonth(date.lengthOfMonth()).atTime(LocalTime.MAX);
    }
}