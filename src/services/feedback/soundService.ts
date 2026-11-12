import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const snapAsset = require('../../../assets/sounds/snap.wav');
const successAsset = require('../../../assets/sounds/success.wav');
const errorAsset = require('../../../assets/sounds/error.wav');

class SoundService {
  private enabled = true;
  private initialized = false;
  private snapPlayer: AudioPlayer | null = null;
  private successPlayer: AudioPlayer | null = null;
  private errorPlayer: AudioPlayer | null = null;

  async init(initialEnabled?: boolean): Promise<void> {
    if (typeof initialEnabled === 'boolean') {
      this.enabled = initialEnabled;
    }
    if (this.initialized) return;

    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
      });

      this.snapPlayer = createAudioPlayer(snapAsset);
      this.successPlayer = createAudioPlayer(successAsset);
      this.errorPlayer = createAudioPlayer(errorAsset);
      this.initialized = true;
    } catch (e) {
      console.warn('Ses motoru başlatılamadı:', e);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private async playPlayer(player: AudioPlayer | null, asset: number): Promise<void> {
    if (!this.enabled) return;

    try {
      if (!this.initialized) {
        await this.init();
      }
      const target = player ?? createAudioPlayer(asset);
      await target.seekTo(0);
      target.play();
    } catch {
      // Ses çalınamayan ortamlarda sessizce devam et
    }
  }

  async playSnap(): Promise<void> {
    await this.playPlayer(this.snapPlayer, snapAsset);
  }

  async playSuccess(): Promise<void> {
    await this.playPlayer(this.successPlayer, successAsset);
  }

  async playError(): Promise<void> {
    await this.playPlayer(this.errorPlayer, errorAsset);
  }
}

export const soundService = new SoundService();

