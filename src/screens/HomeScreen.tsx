import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  background: '#F8FAF5',
  green: '#315C49',
  secondaryText: '#4B6255',
  border: '#DDE7DC',
  white: '#FFFFFF',
  memory: '#E4F1E5',
  picture: '#FFF0D9',
  color: '#E7EDFF',
  daily: '#F0EDE3',
};

export type ActivityId = 'memory' | 'picture' | 'color' | 'daily';

type Activity = {
  id: ActivityId;
  icon: string;
  title: string;
  description: string;
  backgroundColor: string;
};

const activities: Activity[] = [
  {
    id: 'memory',
    icon: '🧠',
    title: 'Memory Match',
    description: 'Find matching pictures and exercise your memory.',
    backgroundColor: palette.memory,
  },
  {
    id: 'picture',
    icon: '🌻',
    title: 'Picture Recognition',
    description: 'Look at familiar pictures and identify what you see.',
    backgroundColor: palette.picture,
  },
  {
    id: 'color',
    icon: '🎨',
    title: 'Color Memory',
    description: 'Look at the colors and remember their order.',
    backgroundColor: palette.color,
  },
  {
    id: 'daily',
    icon: '🌼',
    title: 'Daily Activities',
    description: 'Enjoy a little activity whenever you feel ready.',
    backgroundColor: palette.daily,
  },
];

type HomeScreenProps = {
  onLogout: () => void;
  onSelectActivity: (activity: ActivityId) => void;
};

function HomeScreen({ onLogout, onSelectActivity }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
        <View
          accessibilityRole="header"
          style={styles.brand}
        >
          <Text style={styles.brandName} accessibilityLabel="MindBloom">
            🌷 MindBloom
          </Text>
          <Text style={styles.tagline}>A little moment for your mind</Text>
        </View>

        <View style={styles.welcome}>
          <Text accessibilityRole="header" style={styles.welcomeTitle}>
            Welcome! 💚
          </Text>
          <Text style={styles.welcomeDescription}>
            Let&apos;s enjoy some fun activities together.
          </Text>
          <Text style={styles.supportingText}>Take your time. There is no rush.</Text>
        </View>

        <View style={styles.activities}>
          {activities.map(activity => (
            <Pressable
              key={activity.id}
              accessibilityRole="button"
              accessibilityLabel={`${activity.title}. ${activity.description}`}
              accessibilityHint="Opens this activity"
              onPress={() => onSelectActivity(activity.id)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: activity.backgroundColor },
                pressed && styles.cardPressed,
              ]}
            >
              <View
                accessible={false}
                importantForAccessibility="no"
                style={styles.iconContainer}
              >
                <Text style={styles.icon}>{activity.icon}</Text>
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{activity.title}</Text>
                <Text style={styles.cardDescription}>
                  {activity.description}
                </Text>
              </View>
              <Text
                accessible={false}
                importantForAccessibility="no"
                style={styles.chevron}
              >
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>
          Every little moment counts. You&apos;re doing great! 💚
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 10,
  },
  logoutText: {
    color: palette.green,
    fontSize: 16,
    fontWeight: '700',
  },
  brandName: {
    color: palette.green,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  tagline: {
    color: palette.secondaryText,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  welcome: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    color: palette.green,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  welcomeDescription: {
    color: palette.green,
    fontSize: 19,
    lineHeight: 27,
    marginTop: 8,
    textAlign: 'center',
  },
  supportingText: {
    color: palette.secondaryText,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 5,
    textAlign: 'center',
  },
  activities: {
    gap: 14,
  },
  card: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 112,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardPressed: {
    opacity: 0.82,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 16,
    height: 58,
    justifyContent: 'center',
    marginRight: 14,
    width: 58,
  },
  icon: {
    fontSize: 30,
  },
  cardCopy: {
    flex: 1,
  },
  cardTitle: {
    color: palette.green,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 26,
  },
  cardDescription: {
    color: palette.secondaryText,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 3,
  },
  chevron: {
    color: palette.green,
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    color: palette.green,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
    marginTop: 24,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
