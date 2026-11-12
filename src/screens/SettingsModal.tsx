import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { X, Volume2, VolumeX, Smartphone, ShieldCheck, Settings } from 'lucide-react-native';
import { AppSettings } from '../core/types/settings.types';
import { COLORS } from '../core/theme/colors';

interface SettingsModalProps {
  visible: boolean;
  settings: AppSettings;
  onToggleSound: (enabled: boolean) => void;
  onToggleHaptics: (enabled: boolean) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onToggleSound,
  onToggleHaptics,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Üst Başlık */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.headerIconBox}>
                <Settings size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Ayarlar</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Oyun seslerini ve dokunsal tepkileri özelleştir</Text>

          {/* Ayarlar Listesi */}
          <View style={styles.optionsList}>
            {/* 1. Ses Efektleri */}
            <View style={styles.optionRow}>
              <View style={[styles.optionIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                {settings.soundEnabled ? (
                  <Volume2 size={22} color={COLORS.primary} />
                ) : (
                  <VolumeX size={22} color={COLORS.textMuted} />
                )}
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>Ses Efektleri</Text>
                <Text style={styles.optionDesc}>
                  Parça yerine oturduğunda tık sesi ve tamamlama melodisi
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={onToggleSound}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 2. Titreşim (Haptics) */}
            <View style={styles.optionRow}>
              <View style={[styles.optionIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <Smartphone
                  size={22}
                  color={settings.hapticsEnabled ? COLORS.secondary : COLORS.textMuted}
                />
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>Titreşim (Haptic)</Text>
                <Text style={styles.optionDesc}>
                  Doğru eşleşmede klik, yanlış denemede uyarı titreşimi
                </Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={onToggleHaptics}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Gizlilik Bilgisi */}
          <View style={styles.privacyBanner}>
            <ShieldCheck size={18} color={COLORS.accent} style={{ marginRight: 10 }} />
            <Text style={styles.privacyText}>
              Tüm fotoğrafların ve puzzle kayıtların yalnızca kendi cihazında güvenle saklanır.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  optionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
  },
  privacyText: {
    flex: 1,
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});

