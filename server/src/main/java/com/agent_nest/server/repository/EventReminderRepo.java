package com.agent_nest.server.repository;

import com.agent_nest.server.model.entity.EventReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventReminderRepo extends JpaRepository<EventReminder, Long> {
    List<EventReminder> findByRemindAtBeforeAndSentFalse(LocalDateTime time);
    List<EventReminder> findByUserIdAndRemindAtBeforeAndSentFalse(Long userId, LocalDateTime time);
}


