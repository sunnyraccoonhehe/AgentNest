package com.agent_nest.server.repository;

import com.agent_nest.server.model.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {


    /**
     * Найти все события пользователя
     */
    List<Event> findByUserIdOrderByStartTimeAsc(Long userId);

    /**
     * Найти события по точной дате (используя Between)
     */
    default List<Event> findByUserIdAndDate(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, startOfDay, endOfDay);
    }

    /**
     * Найти события между двумя датами (простые непересекающиеся)
     */
    List<Event> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );

    /**
     * Поиск событий по названию
     */
    List<Event> findByUserIdAndTitleContainingIgnoreCaseOrderByStartTimeAsc(
            Long userId,
            String title
    );

    /**
     * Найти будущие события
     */
    List<Event> findByUserIdAndStartTimeAfterOrderByStartTimeAsc(
            Long userId,
            LocalDateTime now
    );

    /**
     * Найти события за сегодня
     */
    default List<Event> findTodayEvents(Long userId) {
        return findByUserIdAndDate(userId, LocalDate.now());
    }


    /**
     * Найти события в диапазоне дат (с учётом пересечений)
     * = все события, которые:
     * - начинаются внутри диапазона ИЛИ
     * - заканчиваются внутри диапазона ИЛИ
     * - полностью содержат диапазон
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND ((e.startTime BETWEEN :start AND :end) " +
            "OR (e.endTime BETWEEN :start AND :end) " +
            "OR (e.startTime <= :start AND e.endTime >= :end)) " +
            "ORDER BY e.startTime")
    List<Event> findEventsInRange(@Param("userId") Long userId,
                                  @Param("start") LocalDateTime start,
                                  @Param("end") LocalDateTime end);

    /**
     * Проверить пересечение с другими событиями (при создании)
     */
    @Query("SELECT COUNT(e) > 0 FROM Event e " +
            "WHERE e.user.id = :userId " +
            "AND e.startTime < :end " +
            "AND e.endTime > :start")
    boolean existsOverlappingEvent(@Param("userId") Long userId,
                                   @Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);

    /**
     * Проверить пересечение с другими событиями (при обновлении, исключая текущее)
     */
    @Query("SELECT COUNT(e) > 0 FROM Event e " +
            "WHERE e.user.id = :userId " +
            "AND e.id != :eventId " +
            "AND e.startTime < :end " +
            "AND e.endTime > :start")
    boolean existsOverlappingEventExcludingSelf(@Param("userId") Long userId,
                                                @Param("eventId") Long eventId,
                                                @Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end);

    /**
     * Найти все события за конкретную дату (через DATE функции)
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND DATE(e.startTime) = :date " +
            "ORDER BY e.startTime")
    List<Event> findEventsByDate(@Param("userId") Long userId,
                                 @Param("date") LocalDate date);

    /**
     * Найти события по категории
     */
    @Query("SELECT e FROM Event e JOIN e.categories c " +
            "WHERE e.user.id = :userId AND c.id = :categoryId " +
            "ORDER BY e.startTime")
    List<Event> findEventsByCategory(@Param("userId") Long userId,
                                     @Param("categoryId") Long categoryId);

    /**
     * Найти события по нескольким категориям
     */
    @Query("SELECT DISTINCT e FROM Event e JOIN e.categories c " +
            "WHERE e.user.id = :userId AND c.id IN :categoryIds " +
            "ORDER BY e.startTime")
    List<Event> findEventsByCategories(@Param("userId") Long userId,
                                       @Param("categoryIds") List<Long> categoryIds);

    /**
     * Найти все события в диапазоне для конкретной категории
     */
    @Query("SELECT e FROM Event e JOIN e.categories c " +
            "WHERE e.user.id = :userId AND c.id = :categoryId " +
            "AND e.startTime < :end AND e.endTime > :start " +
            "ORDER BY e.startTime")
    List<Event> findEventsInRangeByCategory(@Param("userId") Long userId,
                                            @Param("categoryId") Long categoryId,
                                            @Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);

    /**
     * Найти предстоящие события (следующие N дней)
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND e.startTime BETWEEN :now AND :future " +
            "ORDER BY e.startTime")
    List<Event> findUpcomingEvents(@Param("userId") Long userId,
                                   @Param("now") LocalDateTime now,
                                   @Param("future") LocalDateTime future);

    /**
     * Найти события, которые сейчас происходят
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND e.startTime <= :now AND e.endTime >= :now " +
            "ORDER BY e.startTime")
    List<Event> findCurrentEvents(@Param("userId") Long userId,
                                  @Param("now") LocalDateTime now);

    /**
     * Посчитать количество событий у пользователя
     */
    @Query("SELECT COUNT(e) FROM Event e WHERE e.user.id = :userId " +
            "AND e.startTime BETWEEN :start AND :end")
    long countEventsInRange(@Param("userId") Long userId,
                            @Param("start") LocalDateTime start,
                            @Param("end") LocalDateTime end);

    /**
     * Найти все дневные события (не all-day)
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND e.isAllDay = false " +
            "AND e.startTime BETWEEN :start AND :end " +
            "ORDER BY e.startTime")
    List<Event> findTimedEventsInRange(@Param("userId") Long userId,
                                       @Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    /**
     * Найти все all-day события
     */
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId " +
            "AND e.isAllDay = true " +
            "AND DATE(e.startTime) BETWEEN :startDate AND :endDate " +
            "ORDER BY e.startTime")
    List<Event> findAllDayEventsInRange(@Param("userId") Long userId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    // ==================== УДАЛЕНИЕ ====================

    /**
     * Удалить все события пользователя
     */
    void deleteByUserId(Long userId);

    /**
     * Удалить события за период
     */
    @Query("DELETE FROM Event e WHERE e.user.id = :userId " +
            "AND e.startTime BETWEEN :start AND :end")
    void deleteEventsInRange(@Param("userId") Long userId,
                             @Param("start") LocalDateTime start,
                             @Param("end") LocalDateTime end);

    /**
     * Удалить старые события (старше указанной даты)
     */
    void deleteByUserIdAndEndTimeBefore(Long userId, LocalDateTime date);

    // ==================== ПРОВЕРКИ ====================

    /**
     * Проверить, есть ли события в диапазоне
     */
    boolean existsByUserIdAndStartTimeBetween(Long userId,
                                              LocalDateTime start,
                                              LocalDateTime end);

    /**
     * Проверить, есть ли события с таким названием у пользователя
     */
    boolean existsByUserIdAndTitleIgnoreCase(Long userId, String title);
}