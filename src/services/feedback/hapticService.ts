import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

export const hapticService = {
  setEnabled: (enabled: boolean) => {
    hapticsEnabled = enabled;
  },

  isEnabled: (): boolean => hapticsEnabled,

  // Parça doğru yuvaya oturduğunda (Klik hissi)
  snapFeedback: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
  },

  // Oyun tamamlandığında (Kupa / Başarı)
  successFeedback: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore
    }
  },

  // Normal dokunma
  tapFeedback: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  },

  // Parça oranın değilse / Yanlış deneme (Hata Titreşimi)
  errorFeedback: async () => {
    if (!hapticsEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // ignore
      }
    }
  },
};
