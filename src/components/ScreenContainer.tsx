import { ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export function ScreenContainer({
  children,
  scroll = true,
  style,
  contentStyle
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  if (!scroll) {
    return <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={[styles.root, style]}>
      <ScrollView contentContainerStyle={[styles.content, contentStyle]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    paddingBottom: 120
  }
});
