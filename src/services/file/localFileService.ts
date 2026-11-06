import * as FileSystem from 'expo-file-system/legacy';

const PUZZLE_IMAGES_DIR = `${FileSystem.documentDirectory ?? ''}puzzle_images/`;

export const localFileService = {
  /**
   * Resim dizini yoksa oluşturur
   */
  ensureDirectoryExists: async (): Promise<void> => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(PUZZLE_IMAGES_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(PUZZLE_IMAGES_DIR, { intermediates: true });
      }
    } catch (e) {
      console.warn('Klasör oluşturulurken hata:', e);
    }
  },

  /**
   * Dışarıdan veya galeriden gelen resmi uygulamanın kalıcı klasörüne kopyalar
   */
  saveImageLocally: async (sourceUri: string): Promise<string> => {
    await localFileService.ensureDirectoryExists();
    const fileName = `puzzle_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const destinationUri = `${PUZZLE_IMAGES_DIR}${fileName}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  },

  /**
   * Belirtilen resmi siler
   */
  deleteImage: async (uri: string): Promise<void> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (e) {
      console.warn('Resim silinirken hata:', e);
    }
  },
};
