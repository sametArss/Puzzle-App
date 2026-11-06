import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Plus,
  Play,
  Bookmark,
  Camera,
  Trash2,
  Clock,
  Layers,
  ChevronRight,
  ImageIcon,
} from 'lucide-react-native';
import { PuzzleGameState, DifficultyLevel } from '../core/types/puzzle.types';
import { asyncStorageService } from '../services/storage/asyncStorageService';
import { localFileService } from '../services/file/localFileService';
import { hapticService } from '../services/feedback/hapticService';
import { DifficultySelectModal } from './DifficultyModal';
import { SpinningPuzzleLogo } from '../components/common/SpinningPuzzleLogo';
import { COLORS } from '../core/theme/colors';

interface HomeScreenProps {
  onStartNewGame: (imageUri: string, gridSize: DifficultyLevel) => void;
  onResumeGame: (state: PuzzleGameState) => void;
  onOpenCollection: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartNewGame,
  onResumeGame,
  onOpenCollection,
}) => {
  const [activeGame, setActiveGame] = useState<PuzzleGameState | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isDifficultyModalVisible, setIsDifficultyModalVisible] = useState(false);

  const loadDashboardData = useCallback(async () => {
    const saved = await asyncStorageService.getActiveGame();
    setActiveGame(saved);

    const collection = await asyncStorageService.getCollection();
    setCompletedCount(collection.length);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Galeriden Fotoğraf Seç
  const handlePickImage = async () => {
    hapticService.tapFeedback();
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri izni vermen gerekiyor.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const localUri = await localFileService.saveImageLocally(pickerResult.assets[0].uri);
        setSelectedImageUri(localUri);
        setIsDifficultyModalVisible(true);
      }
    } catch (e) {
      console.error('Fotoğraf seçerken hata:', e);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir problem oluştu.');
    }
  };

  // Kameradan Fotoğraf Çek
  const handleTakePhoto = async () => {
    hapticService.tapFeedback();
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('İzin Gerekli', 'Kamera kullanabilmek için kamera izni vermen gerekiyor.');
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!cameraResult.canceled && cameraResult.assets.length > 0) {
        const localUri = await localFileService.saveImageLocally(cameraResult.assets[0].uri);
        setSelectedImageUri(localUri);
        setIsDifficultyModalVisible(true);
      }
    } catch (e) {
      console.error('Kamera açılırken hata:', e);
      Alert.alert('Hata', 'Kamera kullanılırken bir problem oluştu.');
    }
  };

  const handleDifficultySelected = (gridSize: DifficultyLevel) => {
    if (selectedImageUri) {
      setIsDifficultyModalVisible(false);
      onStartNewGame(selectedImageUri, gridSize);
    }
  };

  const handleDeleteActiveGame = () => {
    hapticService.tapFeedback();
    Alert.alert(
      'Yarım Kalan Oyunu Sil',
      'Bu oyun silinecek ve baştan başlaman gerekecek. Emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await asyncStorageService.clearActiveGame();
            setActiveGame(null);
          },
        },
      ]
    );
  };

  const placedCount = activeGame ? activeGame.pieces.filter((p) => p.isPlaced).length : 0;
  const totalCount = activeGame ? activeGame.pieces.length : 1;
  const progressPercent = Math.round((placedCount / totalCount) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Üst Alan: DÖNEN PUZZLE ANİMASYONU & BAŞLIK */}
        <View style={styles.heroSection}>
          <SpinningPuzzleLogo size={105} />

          <Text style={styles.brandTitle}>Jigsaw Studio</Text>
          <Text style={styles.brandSubtitle}>
            Kendi fotoğraflarını parçala, sürükle ve zihnini dinlendir
          </Text>
        </View>

        {/* 2. Kaldığın Yerden Devam Et (Varsa) */}
        {activeGame && !activeGame.isCompleted && (
          <View style={styles.resumeCard}>
            <View style={styles.resumeHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Devam Eden Oyun</Text>
              </View>
              <TouchableOpacity onPress={handleDeleteActiveGame} style={styles.deleteBtn}>
                <Trash2 size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.resumeBody}>
              <Image source={{ uri: activeGame.imageUri }} style={styles.resumeThumb} />
              <View style={styles.resumeInfo}>
                <Text style={styles.resumeInfoTitle}>
                  {activeGame.gridSize}x{activeGame.gridSize} ({activeGame.pieces.length} Parça)
                </Text>
                <Text style={styles.resumeInfoSub}>
                  %{progressPercent} Tamamlandı ({placedCount}/{totalCount})
                </Text>

                {/* Neon Progress Bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onResumeGame(activeGame)}
              style={styles.resumeBtn}
            >
              <Play size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.resumeBtnText}>Kaldığın Yerden Devam Et</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. Ana Eylem Kartları */}
        <Text style={styles.sectionHeader}>Yeni Bir Puzzle Yap</Text>

        <View style={styles.actionCardsGroup}>
          {/* Galeriden Seç (Öne Çıkan Kart) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePickImage}
            style={styles.primaryActionCard}
          >
            <View style={styles.primaryActionGlow} />
            <View style={styles.primaryActionContent}>
              <View style={styles.primaryIconBox}>
                <ImageIcon size={30} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.primaryActionTitle}>Galeriden Fotoğraf Seç</Text>
                <Text style={styles.primaryActionDesc}>
                  Telefonundaki bir anıyı veya manzarayı Jigsaw puzzle yap
                </Text>
              </View>
              <View style={styles.circleArrowBtn}>
                <Plus size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Kameradan Anlık Çek */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleTakePhoto}
            style={styles.secondaryActionCard}
          >
            <View style={styles.cameraIconBox}>
              <Camera size={22} color={COLORS.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryActionTitle}>Anlık Fotoğraf Çek</Text>
              <Text style={styles.secondaryActionDesc}>Kameranı aç ve hemen bir kareyi böl</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 4. Koleksiyonum Kartı (Vitrin) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenCollection}
          style={styles.collectionBanner}
        >
          <View style={styles.collectionIconBox}>
            <Bookmark size={24} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.collectionTitle}>Koleksiyonum</Text>
            <Text style={styles.collectionDesc}>
              {completedCount > 0
                ? `${completedCount} adet tamamlanmış puzzle vitrinde sergileniyor`
                : 'Tamamladığın eserler albümünde toplanır'}
            </Text>
          </View>
          <View style={styles.collectionCountBadge}>
            <Layers size={13} color={COLORS.accent} style={{ marginRight: 4 }} />
            <Text style={styles.collectionCountNum}>{completedCount}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Zorluk Seçim Modalı */}
      <DifficultySelectModal
        visible={isDifficultyModalVisible}
        onClose={() => setIsDifficultyModalVisible(false)}
        onSelect={handleDifficultySelected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.8,
    marginTop: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
    lineHeight: 19,
  },
  resumeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.45)',
    marginBottom: 26,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  liveBadgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
  resumeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  resumeThumb: {
    width: 58,
    height: 58,
    borderRadius: 14,
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  resumeInfo: {
    flex: 1,
  },
  resumeInfoTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  resumeInfoSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  resumeBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  actionCardsGroup: {
    gap: 12,
    marginBottom: 24,
  },
  primaryActionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryActionGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  primaryActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  primaryActionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  circleArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  cameraIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(236, 72, 153, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  secondaryActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  secondaryActionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  collectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  collectionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  collectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  collectionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  collectionCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  collectionCountNum: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
