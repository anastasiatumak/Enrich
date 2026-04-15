import { create } from "zustand";
import { api } from "../services/api";

export interface Flashcard {
  id: number;
  word: string;
  difficultyLevel: string | null;
  translation: string | null;
  partOfSpeech: string | null;
  transcription: string | null;
  meaning: string | null;
  example: string | null;
  isSaved: boolean;
  isPersonal: boolean;
  createdAt?: string;
}

interface FlashcardState {
  globalFlashcards: Flashcard[];
  personalFlashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  fetchGlobalFlashcards: () => Promise<void>;
  fetchPersonalFlashcards: () => Promise<void>;
  toggleSaveFlashcard: (id: number) => Promise<void>;
  createFlashcard: (dto: any) => Promise<void>;
  updateFlashcard: (dto: any) => Promise<void>;
  deleteFlashcard: (id: number) => Promise<void>;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  globalFlashcards: [],
  personalFlashcards: [],
  isLoading: false,
  error: null,

  fetchGlobalFlashcards: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching global flashcards...');
      const response = await api.get<Flashcard[]>("flashcards/global");
      console.log('Global flashcards response:', response.data.length, 'items');
      set({ globalFlashcards: response.data, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching global flashcards:', err.response?.data || err.message);
      set({ error: err.message, isLoading: false });
    }
  },

  fetchPersonalFlashcards: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching personal flashcards...');
      const response = await api.get<Flashcard[]>("flashcards/personal");
      console.log('Personal flashcards response:', response.data.length, 'items');
      set({ personalFlashcards: response.data.map(f => ({ ...f, isSaved: true })), isLoading: false });
    } catch (err: any) {
      console.error('Error fetching personal flashcards:', err.response?.data || err.message);
      set({ error: err.message, isLoading: false });
    }
  },

  toggleSaveFlashcard: async (id: number) => {
    try {
      const response = await api.post(`flashcards/${id}/toggle-save`);
      const { isSaved } = response.data;

      // Update global list
      set((state) => ({
        globalFlashcards: state.globalFlashcards.map((f) =>
          f.id === id ? { ...f, isSaved } : f
        ),
      }));

      // Update personal list
      if (isSaved) {
        const wordInGlobal = get().globalFlashcards.find(f => f.id === id);
        if (wordInGlobal) {
          set(state => ({
            personalFlashcards: [...state.personalFlashcards, { ...wordInGlobal, isSaved: true }]
          }));
        } else {
            // Fallback: fetch personal list
            get().fetchPersonalFlashcards();
        }
      } else {
        set((state) => ({
          personalFlashcards: state.personalFlashcards.filter((f) => f.id !== id),
        }));
      }
    } catch (err: any) {
      console.error("Failed to toggle save", err);
    }
  },

  createFlashcard: async (dto) => {
    try {
      await api.post("flashcards", dto);
      get().fetchPersonalFlashcards();
    } catch (err: any) {
      console.error("Failed to create flashcard", err);
    }
  },

  updateFlashcard: async (dto) => {
    const flashcard = get().personalFlashcards.find(f => f.id === dto.id);
    
    if (flashcard && !flashcard.isPersonal) {
      // If editing a system word, we create a new personal word and unsave the current one
      try {
        await api.post("flashcards", dto);
        await api.post(`flashcards/${dto.id}/toggle-save`); // Unsave system card
        get().fetchPersonalFlashcards();
      } catch (err: any) {
        console.error("Failed to clone system flashcard on edit", err);
      }
      return;
    }

    try {
      await api.put("flashcards", dto);
      get().fetchPersonalFlashcards();
    } catch (err: any) {
      console.error("Failed to update flashcard", err);
    }
  },

  deleteFlashcard: async (id) => {
    const flashcard = get().personalFlashcards.find(f => f.id === id);
    if (!flashcard) return;

    if (!flashcard.isPersonal) {
      // It's a system word, so we just "unsave" it
      await get().toggleSaveFlashcard(id);
      return;
    }

    try {
      await api.delete(`flashcards/${id}`);
      set((state) => ({
        personalFlashcards: state.personalFlashcards.filter((f) => f.id !== id),
        globalFlashcards: state.globalFlashcards.map((f) =>
          f.id === id ? { ...f, isSaved: false } : f
        ),
      }));
    } catch (err: any) {
      console.error("Failed to delete flashcard", err);
    }
  },
}));
