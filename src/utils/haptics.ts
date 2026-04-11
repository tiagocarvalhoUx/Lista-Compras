import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export async function impactLight() {
  if (Platform.OS === 'web') return;
  try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
}

export async function impactMedium() {
  if (Platform.OS === 'web') return;
  try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
}

export async function notifySuccess() {
  if (Platform.OS === 'web') return;
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
}

export async function notifyWarning() {
  if (Platform.OS === 'web') return;
  try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
}
