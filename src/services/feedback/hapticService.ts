import * as Haptics from 'expo-haptics';

export const hapticService = {
  // Parça doğru yuvaya oturduğunda (Klik hissi)
  snapFeedback: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
  },

  // Oyun tamamlandığında (Kupa / Başarı)
  successFeedback: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore
    }
  },

  // Normal dokunma
  tapFeedback: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  },

  // Parça oranın değilse / Yanlış deneme (Hata Titreşimi)
  errorFeedback: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Cihaz notificationAsync desteklemiyorsa Heavy impact dene
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // ignore
      }
    }
  },
};
