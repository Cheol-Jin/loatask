CREATE TABLE IF NOT EXISTS lost_ark_character (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    character_name VARCHAR(255),
    job_name VARCHAR(255),
    item_level INTEGER,
    server_name VARCHAR(255),
    character_image VARCHAR(255),
    expedition_level INTEGER
);

CREATE TABLE IF NOT EXISTS character_search (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    character_name VARCHAR(255) NOT NULL UNIQUE,
    search_count BIGINT NOT NULL,
    updated_at DATETIME(6) NOT NULL
);
