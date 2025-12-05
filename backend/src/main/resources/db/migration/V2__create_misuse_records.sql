-- V2: create misuse_records table
CREATE TABLE IF NOT EXISTS misuse_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL
);

