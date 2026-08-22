import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { queryKeys } from '@/query/keys';
import {
  errorMessage,
  getSavedHadiths,
  saveHadith,
  unsaveHadith,
} from '@/services/hadith';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/HadithDetailScreen';
import { useTheme } from '@/theme/ThemeProvider';

type HadithDetailScreenProps = {
  hadith: HadithRecord;
  onBack: () => void;
};

export default function HadithDetailScreen({
  hadith,
  onBack,
}: HadithDetailScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();
  const grades = hadith.grade?.filter(Boolean) ?? [];
  const savedQuery = useQuery({
    queryKey: queryKeys.hadiths.saved,
    queryFn: getSavedHadiths,
  });
  const isSaved = savedQuery.data?.some((item) => item.id === hadith.id) ?? false;

  const saveMutation = useMutation({
    mutationFn: () =>
      isSaved ? unsaveHadith(hadith.id) : saveHadith(hadith.id),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.hadiths.saved });
      Toast.show({
        type: 'success',
        text1: isSaved ? 'Removed' : 'Saved',
        text2: isSaved
          ? 'Hadith removed from bookmarks'
          : 'Hadith saved to bookmarks',
      });
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: errorMessage(err, 'Could not update saved Hadith'),
      });
    },
  });

  const Field = ({
    label,
    value,
    rtl,
    grow,
  }: {
    label: string;
    value?: string | number | null;
    rtl?: boolean;
    grow?: boolean;
  }) => {
    const text = value === 0 || value ? String(value) : '';
    return (
      <View style={grow ? styles.fieldFlex : styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueBox}>
          <Text
            style={[
              styles.value,
              rtl ? styles.valueRtl : null,
              text ? null : styles.empty,
            ]}
          >
            {text || '—'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {hadith.book || 'Hadith'}
        </Text>
        <TouchableOpacity
          onPress={() => saveMutation.mutate()}
          style={styles.backButton}
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save Hadith'}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.row}>
          <Field label="Hadith no" value={hadith.hadithNumber} grow />
          <Field label="Arabic no" value={hadith.arabicNumber} grow />
        </View>

        <Field label="Chapter" value={hadith.chapter} />
        <Field label="Narration" value={hadith.narrator} />

        <View style={styles.field}>
          <Text style={styles.label}>Topic</Text>
          {hadith.topic ? (
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{hadith.topic}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.valueBox}>
              <Text style={[styles.value, styles.empty]}>—</Text>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Grade</Text>
          {grades.length ? (
            <View style={styles.chips}>
              {grades.map((grade) => (
                <View key={grade} style={styles.chip}>
                  <Text style={styles.chipText}>{grade}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.valueBox}>
              <Text style={[styles.value, styles.empty]}>—</Text>
            </View>
          )}
        </View>

        <Text style={styles.heading}>Translation</Text>
        <Field label="English" value={hadith.translation?.english} />
        <Field label="Urdu" value={hadith.translation?.urdu} rtl />
        <Field label="Arabic" value={hadith.translation?.arabic} rtl />

        <Field label="Text" value={hadith.text} />
        <Field label="Description" value={hadith.description} />
      </ScrollView>
    </View>
  );
}
