-- Очистка таблиц (опционально)
TRUNCATE users, categories, events, event_categories, recurring_rules RESTART IDENTITY CASCADE;

-- Создание пользователей
INSERT INTO users (username, email, password, first_name, last_name, role, is_active) VALUES
('john_doe', 'john@example.com', 'password123', 'John', 'Doe', 'USER', true),
('alice', 'alice@example.com', 'password123', 'Alice', 'Smith', 'USER', true),
('bob', 'bob@example.com', 'password123', 'Bob', 'Johnson', 'PREMIUM', true);

-- Создание категорий
INSERT INTO categories (name, color, icon, user_id) VALUES
('Работа', '#4CAF50', 'work', 1),
('Личное', '#2196F3', 'person', 1),
('Встречи', '#FF9800', 'meeting', 1);

-- Создание событий
INSERT INTO events (title, description, start_time, end_time, is_all_day, user_id) VALUES
('Совещание', 'Еженедельное собрание',
 NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
 false, 1),
('Встреча с клиентом', 'Обсуждение проекта',
 NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
 false, 1);