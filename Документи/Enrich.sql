CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    theme VARCHAR(50),
    language VARCHAR(50)
);

CREATE TABLE flashcards (
    flashcard_id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    difficulty_level VARCHAR(50),
    translation VARCHAR(255),
    part_of_speech VARCHAR(100),
    transcription VARCHAR(255),
    meaning TEXT,
    example TEXT,
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_flashcards (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    flashcard_id INTEGER REFERENCES flashcards(flashcard_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, flashcard_id)
);

CREATE TABLE quiz_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    score_percentage INTEGER
);

CREATE TABLE quiz_answers (
    answer_id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
    flashcard_id INTEGER REFERENCES flashcards(flashcard_id) ON DELETE CASCADE,
    is_known BOOLEAN
);