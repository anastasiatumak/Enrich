INSERT INTO users (username, email, password_hash, role, created_at) VALUES
	('fluffy_kitten', 'kitten@example.com', 'hash_1', 'student', '2026-03-01 10:00:00'),
	('sunshine_user', 'sun@example.com', 'hash_2', 'student', '2026-03-05 12:30:00'),
	('cloud_berry', 'berry@example.com', 'hash_3', 'student', '2026-03-10 15:45:00'),
	('honey_bee', 'bee@example.com', 'hash_4', 'student', '2026-03-15 09:15:00'),
	('admin_marshmallow', 'admin@enrich.com', 'hash_5', 'admin', '2026-01-01 08:00:00');

INSERT INTO user_settings (user_id, theme, language) VALUES
	(1, 'Dark', 'ua'),
	(2, 'Light', 'eng'),
	(3, 'Dark', 'eng'),
	(4, 'Light', 'ua'),
	(5, 'Dark', 'ua');

INSERT INTO flashcards (word, difficulty_level, translation, part_of_speech, transcription, meaning, example, created_by, created_at) VALUES
	('Kitten', 'A1', 'Кошеня', 'Noun', '/ˈkɪt.ən/', 'A young cat', 'The kitten is sleeping on the sofa.', NULL, '2026-04-01 12:00:00'),
	('Puppy', 'A1', 'Цуценя', 'Noun', '/ˈpʌp.i/', 'A young dog', 'He got a puppy for his birthday.', NULL, '2026-04-01 12:05:00'),
	('Marshmallow', 'A2', 'Зефірка', 'Noun', '/ˌmɑːrʃˈmæl.oʊ/', 'A soft, sweet food', 'Hot chocolate with marshmallows is the best.', NULL, '2026-04-01 12:10:00'),
	('Sunshine', 'A2', 'Сонячне світло', 'Noun', '/ˈsʌn.ʃaɪn/', 'Light from the sun', 'You are my sunshine.', NULL, '2026-04-01 12:15:00'),
	('Hug', 'A1', 'Обійми', 'Noun/Verb', '/hʌɡ/', 'To hold someone close', 'I need a big hug.', 1, '2026-04-01 12:20:00'),
	('Butterfly', 'A2', 'Метелик', 'Noun', '/ˈbʌt.ər.flaɪ/', 'A beautiful insect with wings', 'A colorful butterfly sat on a flower.', NULL, '2026-04-01 12:25:00'),
	('Cuddle', 'B1', 'Ніжитися', 'Verb', '/ˈkʌd.əl/', 'To sit or lie very close to someone', 'The baby likes to cuddle with her teddy bear.', 2, '2026-04-01 12:30:00'),
	('Cupcake', 'A2', 'Капкейк', 'Noun', '/ˈkʌp.keɪk/', 'A small cake', 'She baked vanilla cupcakes with pink frosting.', NULL, '2026-04-01 12:35:00'),
	('Bunny', 'A1', 'Зайчик', 'Noun', '/ˈbʌn.i/', 'A rabbit', 'The bunny is eating a carrot.', NULL, '2026-04-01 12:40:00'),
	('Twinkle', 'B1', 'Мерехтіти', 'Verb', '/ˈtwɪŋ.kəl/', 'To shine with a light that changes', 'Twinkle, twinkle, little star.', NULL, '2026-04-01 12:45:00'),
	('Bubble', 'A2', 'Бульбашка', 'Noun', '/ˈbʌb.əl/', 'A ball of air inside a liquid', 'Children love blowing bubbles.', 3, '2026-04-01 12:50:00'),
	('Cozy', 'B1', 'Затишний', 'Adjective', '/ˈkoʊ.zi/', 'Comfortable and warm', 'This sweater is so cozy!', NULL, '2026-04-01 12:55:00'),
	('Sprinkles', 'B1', 'Посипка', 'Noun', '/ˈsprɪŋ.kəlz/', 'Small pieces of sugar for decoration', 'I want extra sprinkles on my ice cream.', NULL, '2026-04-01 13:00:00'),
	('Panda', 'A1', 'Панда', 'Noun', '/ˈpæn.də/', 'A large black-and-white bear', 'The panda is eating bamboo.', NULL, '2026-04-01 13:05:00'),
	('Dreamy', 'B2', 'Мрійливий', 'Adjective', '/ˈdriː.mi/', 'Very pleasant or peaceful', 'What a dreamy sunset!', 4, '2026-04-01 13:10:00'),
	('Sparkle', 'B1', 'Іскритися', 'Verb', '/ˈspɑːr.kəl/', 'To shine with many small points of light', 'The ocean sparkles in the sunlight.', NULL, '2026-04-01 13:15:00'),
	('Lollipop', 'A1', 'Льодяник', 'Noun', '/ˈlɑː.li.pɑːp/', 'A hard sweet on a stick', 'He bought a strawberry lollipop.', NULL, '2026-04-01 13:20:00'),
	('Sweetie', 'B1', 'Любчик/Милий', 'Noun', '/ˈswiː.t̬i/', 'A person you love', 'Goodnight, sweetie!', 1, '2026-04-01 13:25:00'),
	('Cloud', 'A1', 'Хмаринка', 'Noun', '/klaʊd/', 'A white mass in the sky', 'Look at that cloud, it looks like a heart!', NULL, '2026-04-01 13:30:00'),
	('Giggle', 'B1', 'Хіхікати', 'Verb', '/ˈɡɪɡ.əl/', 'To laugh in a nervous or silly way', 'The girls started to giggle.', NULL, '2026-04-01 13:35:00');

INSERT INTO saved_flashcards (user_id, flashcard_id) VALUES
	(1, 1), (1, 3), (1, 10),
	(2, 2), (2, 4), (2, 12),
	(3, 5), (3, 6), (3, 15),
	(4, 7), (4, 8), (4, 20),
	(1, 16), (2, 17), (3, 18);

INSERT INTO quiz_attempts (user_id, started_at, finished_at, score_percentage) VALUES
	(1, '2026-04-01 14:00:00', '2026-04-01 14:05:00', 100),
	(1, '2026-04-01 15:00:00', '2026-04-01 15:10:00', 80),
	(2, '2026-04-01 14:10:00', '2026-04-01 14:15:00', 90),
	(2, '2026-04-01 16:00:00', '2026-04-01 16:05:00', 75),
	(3, '2026-04-01 14:20:00', '2026-04-01 14:25:00', 100),
	(3, '2026-04-01 17:00:00', '2026-04-01 17:10:00', 60),
	(4, '2026-04-01 14:30:00', '2026-04-01 14:35:00', 95),
	(4, '2026-04-01 18:00:00', '2026-04-01 18:05:00', 85),
	(1, '2026-04-01 19:00:00', '2026-04-01 19:05:00', 100),
	(2, '2026-04-01 20:00:00', '2026-04-01 20:05:00', 40),
	(3, '2026-04-01 21:00:00', '2026-04-01 21:05:00', 70),
	(4, '2026-04-01 22:00:00', '2026-04-01 22:05:00', 90),
	(1, '2026-04-02 09:00:00', '2026-04-02 09:05:00', 100),
	(2, '2026-04-02 10:00:00', '2026-04-02 10:05:00', 85),
	(3, '2026-04-02 11:00:00', '2026-04-02 11:05:00', 95);

INSERT INTO quiz_answers (attempt_id, flashcard_id, is_known) VALUES
	(1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE),
	(2, 4, TRUE), (2, 5, FALSE), (2, 6, TRUE),
	(3, 7, TRUE), (3, 8, TRUE), (3, 9, FALSE),
	(4, 10, TRUE), (4, 11, FALSE), (4, 12, TRUE),
	(5, 13, TRUE), (5, 14, TRUE), (5, 15, TRUE);