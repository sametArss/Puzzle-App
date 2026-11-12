import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../../../core/types/settings.types';
import { asyncStorageService } from '../../../services/storage/asyncStorageService';
import { soundService } from '../../../services/feedback/soundService';
import { hapticService } from '../../../services/feedback/hapticService';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    asyncStorageService.getSettings().then((loaded) => {
      if (!mounted) return;
      setSettings(loaded);
      soundService.init(loaded.soundEnabled);
      hapticService.setEnabled(loaded.hapticsEnabled);
      setIsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSound = useCallback(async (enabled: boolean) => {
    setSettings((prev) => {
      const updated = { ...prev, soundEnabled: enabled };
      soundService.setEnabled(enabled);
      asyncStorageService.saveSettings(updated);
      return updated;
    });

    if (enabled) {
      await soundService.playSnap();
    }
    hapticService.tapFeedback();
  }, []);

  const toggleHaptics = useCallback(async (enabled: boolean) => {
    setSettings((prev) => {
      const updated = { ...prev, hapticsEnabled: enabled };
      hapticService.setEnabled(enabled);
      asyncStorageService.saveSettings(updated);
      return updated;
    });

    if (enabled) {
      hapticService.snapFeedback();
    }
  }, []);

  return {
    settings,
    isLoaded,
    toggleSound,
    toggleHaptics,
  };
}

