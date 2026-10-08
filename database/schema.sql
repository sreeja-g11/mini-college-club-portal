-- Mini College Club Portal - MySQL 8 schema
-- You don't need to run this by hand: Spring Boot (Hibernate ddl-auto=update) creates these tables
-- automatically on first start. It is here for reference and for the project report.

CREATE DATABASE IF NOT EXISTS mini_club_portal;
USE mini_club_portal;

CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,              -- BCrypt hash, never the plain password
    role          VARCHAR(20)  NOT NULL,              -- STUDENT or ADMIN
    department    VARCHAR(100),
    study_year    INT,                                -- 1 to 4
    created_at    DATETIME(6)  NOT NULL
);

CREATE TABLE clubs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(80)   NOT NULL UNIQUE,
    category        VARCHAR(20)   NOT NULL,           -- TECHNICAL, CULTURAL, SPORTS, LITERARY, ARTS, COMMUNITY
    tagline         VARCHAR(160)  NOT NULL,
    description     VARCHAR(2000) NOT NULL,
    club_head       VARCHAR(100),
    faculty_advisor VARCHAR(100),
    meeting_info    VARCHAR(120),
    contact_email   VARCHAR(150),
    max_members     INT           NOT NULL,
    active          BIT           NOT NULL,           -- 0 = archived by the admin
    created_at      DATETIME(6)   NOT NULL
);

CREATE TABLE club_members (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id   BIGINT      NOT NULL,
    user_id   BIGINT      NOT NULL,
    joined_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_member_club_user UNIQUE (club_id, user_id),
    CONSTRAINT fk_member_club FOREIGN KEY (club_id) REFERENCES clubs (id),
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE events (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id               BIGINT        NOT NULL,
    title                 VARCHAR(120)  NOT NULL,
    description           VARCHAR(2000),
    venue                 VARCHAR(120)  NOT NULL,
    starts_at             DATETIME(6)   NOT NULL,
    ends_at               DATETIME(6)   NOT NULL,
    registration_deadline DATETIME(6)   NOT NULL,
    capacity              INT           NOT NULL,
    cancelled             BIT           NOT NULL,
    created_at            DATETIME(6)   NOT NULL,
    INDEX idx_event_starts (starts_at),
    CONSTRAINT fk_event_club FOREIGN KEY (club_id) REFERENCES clubs (id)
);

CREATE TABLE event_registrations (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id      BIGINT      NOT NULL,
    user_id       BIGINT      NOT NULL,
    registered_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_registration_event_user UNIQUE (event_id, user_id),
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT fk_registration_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE announcements (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id    BIGINT,                                -- NULL = for the whole college
    title      VARCHAR(140)  NOT NULL,
    body       VARCHAR(3000) NOT NULL,
    pinned     BIT           NOT NULL,
    posted_by  BIGINT        NOT NULL,
    created_at DATETIME(6)   NOT NULL,
    updated_at DATETIME(6),
    INDEX idx_announcement_created (created_at),
    CONSTRAINT fk_announcement_club FOREIGN KEY (club_id) REFERENCES clubs (id),
    CONSTRAINT fk_announcement_user FOREIGN KEY (posted_by) REFERENCES users (id)
);
