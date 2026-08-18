import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

export default function SavedScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Saved</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
});
