import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ActivityId } from './HomeScreen';

type ActivityDetails = {
  icon: string;
  title: string;
  description: string;
};

const activityDetails: Record<ActivityId, ActivityDetails> = {
  memory: {
    icon: '🧠',
    title: 'Memory Match',
    description: 'Find matching pictures and exercise your memory.',
  },
  picture: {
    icon: '🌻',
    title: 'Picture Recognition',
    description: 'Look at familiar pictures and identify what you see.',
  },
  color: {
    icon: '🎨',
    title: 'Color Memory',
    description: 'Look at the colors and remember their order.',
  },
  daily: {
    icon: '🌼',
    title: 'Daily Activities',
    description: 'Enjoy a little activity whenever you feel ready.',
  },
};

type ActivityPlaceholderScreenProps = {
  activity: ActivityId;
  onBack: () => void;
};

function ActivityPlaceholderScreen({
  activity,
  onBack,
}: ActivityPlaceholderScreenProps) {
  const details = activityDetails[activity];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to activities"
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backText}>‹  Back to activities</Text>
        </Pressable>
        <View style={styles.message}>
          <Text accessibilityLabel={details.title} style={styles.icon}>
            {details.icon}
          </Text>
          <Text accessibilityRole="header" style={styles.title}>
            {details.title}
          </Text>
          <Text style={styles.description}>{details.description}</Text>
          <Text style={styles.comingSoon}>
            This activity is not available yet. You can come back whenever
            you&apos;re ready.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to activities"
          onPress={onBack}
          style={({ pressed }) => [
            styles.returnButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.returnText}>Return to activities</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAF5',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22,
  },
  backButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#315C49',
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    fontSize: 58,
    marginBottom: 16,
  },
  title: {
    color: '#315C49',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: '#4B6255',
    fontSize: 18,
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'center',
  },
  comingSoon: {
    color: '#4B6255',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 24,
    textAlign: 'center',
  },
  returnButton: {
    alignItems: 'center',
    backgroundColor: '#315C49',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  returnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});

export default ActivityPlaceholderScreen;
