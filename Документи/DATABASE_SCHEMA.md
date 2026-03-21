# Схема бази даних проєкту Enrich

Ця діаграма описує архітектуру даних застосунку, включаючи користувачів, картки слів (flashcards) та систему тестування.

```mermaid
---
config:
  theme: mc
  look: classic
---
classDiagram
    class User {
        +int user_id PK
        +string username
        +string email
        +string password_hash
        +string role
        +datetime created_at
    }

    class UserSettings {
        +int user_id PK, FK
        +string theme
        +string language
    }

    class Flashcard {
        +int flashcard_id PK
        +string word
        +string translation
        +string meaning
        +string example
        +string part_of_speech
        +string transcription
        +string difficulty_level
        +int created_by FK
        +datetime created_at
    }

    class SavedFlashcard {
        +int user_id FK
        +int flashcard_id FK
    }

    class QuizAttempt {
        +int attempt_id PK
        +int user_id FK
        +datetime started_at
        +datetime finished_at
        +int score_percentage
    }

    class QuizAnswer {
        +int answer_id PK
        +int attempt_id FK
        +int flashcard_id FK
        +boolean is_known
    }

    User "1" -- "1" UserSettings : has
    User "1" -- "0..*" Flashcard : created_by
    User "1" -- "0..*" SavedFlashcard : saves
    User "1" -- "0..*" QuizAttempt : performs
    
    Flashcard "1" -- "0..*" SavedFlashcard : referenced_in
    Flashcard "1" -- "0..*" QuizAnswer : tested_in
    
    QuizAttempt "1" -- "0..*" QuizAnswer : contains