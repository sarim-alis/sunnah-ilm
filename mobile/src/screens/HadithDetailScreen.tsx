import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/HadithDetailScreen';
import { useTheme } from '@/theme/ThemeProvider';

type HadithDetailScreenProps = {
  hadith: HadithRecord;
  onBack: () => void;
};

function DetailSection({
  label,
  value,
  styles,
  rtl,
}: {
  label: string;
  value?: string;
  styles: ReturnType<typeof createStyles>;
  rtl?: boolean;
}) {
  if (!value) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.body, rtl ? styles.arabic : null]}>{value}</Text>
    </View>
  );
}

export default function HadithDetailScreen({
  hadith,
  onBack,
}: HadithDetailScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const grades = hadith.grade?.filter(Boolean) ?? [];
  const reference =
    hadith.reference?.book || hadith.reference?.hadith
      ? `Book ${hadith.reference.book}, Hadith ${hadith.reference.hadith}`
      : '';

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerBack}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hadith</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.meta}>
          {hadith.book} {hadith.hadithNumber}
          {hadith.arabicNumber ? ` · Arabic ${hadith.arabicNumber}` : ''}
        </Text>
        <Text style={styles.narrator}>{hadith.narrator}</Text>
        {hadith.chapter ? (
          <Text style={styles.chapter}>{hadith.chapter}</Text>
        ) : null}

        {hadith.topic || grades.length ? (
          <View style={styles.chips}>
            {hadith.topic ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{hadith.topic}</Text>
              </View>
            ) : null}
            {grades.map((grade) => (
              <View key={grade} style={styles.chip}>
                <Text style={styles.chipText}>{grade}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <DetailSection label="Text" value={hadith.text} styles={styles} />
        <DetailSection
          label="English"
          value={hadith.translation?.english}
          styles={styles}
        />
        <DetailSection
          label="Urdu"
          value={hadith.translation?.urdu}
          styles={styles}
          rtl
        />
        <DetailSection
          label="Arabic"
          value={hadith.translation?.arabic}
          styles={styles}
          rtl
        />
        <DetailSection label="Reference" value={reference} styles={styles} />
        <DetailSection
          label="Description"
          value={hadith.description}
          styles={styles}
        />
      </ScrollView>
    </View>
  );
}
