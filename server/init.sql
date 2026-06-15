-- =========================================
-- RESET (safe for docker dev only)
-- =========================================
DROP TABLE IF EXISTS event_categories CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(50),
                       last_name VARCHAR(50),
                       timezone VARCHAR(50) DEFAULT 'UTC',
                       avatar_url VARCHAR(500),
                       role VARCHAR(20) CHECK (role IN ('USER','ADMIN','PREMIUM')) DEFAULT 'USER',
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP,
                       updated_at TIMESTAMP,
                       last_login TIMESTAMP
);

-- =========================================
-- CATEGORIES
-- =========================================
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL,
                            color VARCHAR(7),
                            icon VARCHAR(50),
                            description VARCHAR(255),
                            is_default BOOLEAN DEFAULT FALSE,
                            created_at TIMESTAMP,
                            updated_at TIMESTAMP,
                            user_id BIGINT,
                            CONSTRAINT fk_categories_user
                                FOREIGN KEY (user_id) REFERENCES users(id)
                                    ON DELETE CASCADE
);

-- =========================================
-- EVENTS
-- =========================================
CREATE TABLE events (
                        id BIGSERIAL PRIMARY KEY,
                        title VARCHAR(200) NOT NULL,
                        description TEXT,
                        start_time TIMESTAMP NOT NULL,
                        end_time TIMESTAMP NOT NULL,
                        is_all_day BOOLEAN DEFAULT FALSE,
                        color VARCHAR(7),
                        location VARCHAR(255),
                        is_recurring BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP,
                        user_id BIGINT NOT NULL,
                        CONSTRAINT fk_events_user
                            FOREIGN KEY (user_id) REFERENCES users(id)
                                ON DELETE CASCADE
);

-- =========================================
-- MANY TO MANY: EVENT_CATEGORIES
-- =========================================
CREATE TABLE event_categories (
                                  event_id BIGINT NOT NULL,
                                  category_id BIGINT NOT NULL,
                                  PRIMARY KEY (event_id, category_id),
                                  CONSTRAINT fk_ec_event
                                      FOREIGN KEY (event_id) REFERENCES events(id)
                                          ON DELETE CASCADE,
                                  CONSTRAINT fk_ec_category
                                      FOREIGN KEY (category_id) REFERENCES categories(id)
                                          ON DELETE CASCADE
);

-- =========================================
-- SEED DATA (NO HARDCODED IDS!)
-- =========================================

-- USERS
INSERT INTO users (username, email, password, first_name, last_name, role, is_active)
VALUES
    ('john_doe', 'john@example.com', 'password123', 'John', 'Doe', 'USER', true),
    ('alice', 'alice@example.com', 'password123', 'Alice', 'Smith', 'USER', true),
    ('bob', 'bob@example.com', 'password123', 'Bob', 'Johnson', 'PREMIUM', true);

-- CATEGORIES (linked safely via username)
INSERT INTO categories (name, color, icon, description, user_id)
VALUES
    ('Работа', '#4CAF50', 'work', 'Work related tasks',
     (SELECT id FROM users WHERE username = 'john_doe')),

    ('Личное', '#2196F3', 'person', 'Personal tasks',
     (SELECT id FROM users WHERE username = 'john_doe')),

    ('Встречи', '#FF9800', 'meeting', 'Meetings and calls',
     (SELECT id FROM users WHERE username = 'john_doe'));

-- EVENTS (linked safely via username)
INSERT INTO events (title, description, start_time, end_time, is_all_day, user_id)
VALUES
    ('Совещание', 'Еженедельное собрание',
     NOW() + INTERVAL '1 day',
     NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
     false,
     (SELECT id FROM users WHERE username = 'john_doe')),

    ('Встреча с клиентом', 'Обсуждение проекта',
     NOW() + INTERVAL '2 days',
     NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
     false,
     (SELECT id FROM users WHERE username = 'john_doe'));

-- EVENT_CATEGORIES (safe linking via subqueries)
INSERT INTO event_categories (event_id, category_id)
VALUES
    (
        (SELECT id FROM events WHERE title = 'Совещание'),
        (SELECT id FROM categories WHERE name = 'Работа')
    ),
    (
        (SELECT id FROM events WHERE title = 'Встреча с клиентом'),
        (SELECT id FROM categories WHERE name = 'Встречи')
    );