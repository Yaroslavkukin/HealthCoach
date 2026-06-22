import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const supplementsIcon = require('../../assets/images/supplements-icon.png');

export default function TabsLayout() {
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          height: 74,
          paddingBottom: 14,
          paddingTop: 10
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' }
      }}
    >
      <Tabs.Screen name="today" options={{ title: t('common.today'), tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" color={color} size={size} /> }} />
      <Tabs.Screen
        name="supplements"
        options={{
          title: t('common.supplements'),
          tabBarIcon: ({ color }) => (
            <Image
              source={supplementsIcon}
              resizeMode="contain"
              style={[styles.supplementsTabIcon, { tintColor: color }]}
            />
          )
        }}
      />
      <Tabs.Screen name="body" options={{ title: t('common.body'), tabBarIcon: ({ color, size }) => <Ionicons name="body-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="ai" options={{ title: t('common.ai'), tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('common.profile'), tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  supplementsTabIcon: {
    width: 24,
    height: 24,
    marginBottom: -1
  }
});
