-- Create users and time_entries tables required by the new frontend

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS time_entries (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    from_time TIMESTAMP WITH TIME ZONE NOT NULL,
    until_time TIMESTAMP WITH TIME ZONE
);

-- optional index for faster lookups
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);

-- Seed an admin user for convenience (password stored in plain text for this small demo)
INSERT INTO users (username, password, role, name)
SELECT 'admin', 'admin', 'ADMIN', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

