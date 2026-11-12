import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuzzleGameState } from '../../core/types/puzzle.types';
import { CompletedPuzzleItem } from '../../core/types/collection.types';
import { AppSettings, DEFAULT_SETTINGS } from '../../core/types/settings.types';

const STORAGE_KEYS = {
  ACTIVE_GAME: '@puzzle_active_game',
  COLLECTION: '@puzzle_collection',
  SETTINGS: '@puzzle_settings',
};

export const asyncStorageService = {
  // Aktif (Yarıda kalan) oyunu kaydet
  saveActiveGame: async (state: PuzzleGameState): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, JSON.stringify(state));
    } catch (e) {
      console.error('Oyun kaydedilirken hata oluştu:', e);
    }
  },

  // Aktif oyunu getir
  getActiveGame: async (): Promise<PuzzleGameState | null> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Aktif oyun okunurken hata:', e);
      return null;
    }
  },

  // Aktif oyunu sil (tamamlandığında veya yeniye başlandığında)
  clearActiveGame: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
    } catch (e) {
      console.error('Aktif oyun temizlenirken hata:', e);
    }
  },

  // Koleksiyondaki tamamlananları getir
  getCollection: async (): Promise<CompletedPuzzleItem[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTION);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Koleksiyon okunurken hata:', e);
      return [];
    }
  },

  // Tamamlanan puzzle'ı koleksiyona ekle
  saveToCollection: async (item: CompletedPuzzleItem): Promise<void> => {
    try {
      const current = await asyncStorageService.getCollection();
      const updated = [item, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(updated));
    } catch (e) {
      console.error('Koleksiyona eklenirken hata:', e);
    }
  },

  // Koleksiyondan sil
  removeFromCollection: async (id: string): Promise<void> => {
    try {
      const current = await asyncStorageService.getCollection();
      const updated = current.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(updated));
    } catch (e) {
      console.error('Koleksiyondan silinirken hata:', e);
    }
  },

  // Uygulama ayarlarını getir
  getSettings: async (): Promise<AppSettings> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Ayarlar okunurken hata:', e);
      return DEFAULT_SETTINGS;
    }
  },

  // Uygulama ayarlarını kaydet
  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Ayarlar kaydedilirken hata:', e);
    }
  },
};

