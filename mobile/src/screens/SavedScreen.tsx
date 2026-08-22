import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { EyeIcon } from '@/components/EyeIcon';
import HadithDetailScreen from '@/screens/HadithDetailScreen';
import { queryKeys } from '@/query/keys';
import {
  errorMessage,
  getSavedHadiths,
  unsaveHadith,
} from '@/services/hadith';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/adminHadiths';
import { useTheme } from '@/theme/ThemeProvider';

const PAGE_SIZE = 3;

function pageWindow(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

export default function SavedScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();
  const [viewing, setViewing] = useState<HadithRecord | null>(null);
  const [page, setPage] = useState(1);

  const listQuery = useQuery({
    queryKey: queryKeys.hadiths.saved,
    queryFn: getSavedHadiths,
  });

  const hadiths = listQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(hadiths.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = hadiths.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const unsaveMutation = useMutation({
    mutationFn: unsaveHadith,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.hadiths.saved });
      Toast.show({
        type: 'success',
        text1: 'Removed',
        text2: 'Hadith removed from saved',
      });
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: errorMessage(err, 'Could not remove Hadith'),
      });
    },
  });

  if (viewing) {
    return (
      <HadithDetailScreen
        hadith={viewing}
        onBack={() => setViewing(null)}
      />
    );
  }

  const renderItem = ({ item }: { item: HadithRecord }) => {
    const snippet = item.translation?.english || item.text;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setViewing(item)}
        activeOpacity={0.85}
        accessibilityLabel="View Hadith"
      >
        <View style={styles.cardCopy}>
          <Text style={styles.cardMeta}>
            {item.book} {item.hadithNumber}
            {item.topic ? ` · ${item.topic}` : ''}
          </Text>
          <Text style={styles.cardNarrator}>{item.narrator}</Text>
          {item.chapter ? (
            <Text style={styles.cardChapter} numberOfLines={1} ellipsizeMode="tail">
              {item.chapter}
            </Text>
          ) : null}
          <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
            {snippet}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => setViewing(item)}
            style={styles.deleteButton}
            accessibilityLabel="View Hadith"
          >
            <EyeIcon size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => unsaveMutation.mutate(item.id)}
            style={styles.deleteButton}
            accessibilityLabel="Remove from saved"
          >
            <Ionicons name="bookmark" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>

      {listQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : listQuery.isError ? (
        <Text style={styles.empty}>
          {errorMessage(listQuery.error, 'Could not load saved Hadiths')}
        </Text>
      ) : (
        <FlatList
          data={pageItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentPage}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No saved Hadiths yet</Text>
          }
        />
      )}

      {listQuery.isLoading || listQuery.isError || hadiths.length === 0 ? null : (
        <View style={styles.pager}>
          <TouchableOpacity
            onPress={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            style={[
              styles.pagerBtn,
              currentPage === 1 ? styles.pagerBtnDisabled : null,
            ]}
            accessibilityLabel="Previous page"
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.pagerPages}>
            {pageWindow(currentPage, totalPages).map((number) => {
              const active = number === currentPage;
              return (
                <TouchableOpacity
                  key={number}
                  onPress={() => setPage(number)}
                  style={[styles.pagerBtn, active ? styles.pagerBtnActive : null]}
                  accessibilityLabel={`Page ${number}`}
                >
                  <Text style={[styles.pagerNum, active ? styles.pagerNumActive : null]}>
                    {number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            style={[
              styles.pagerBtn,
              currentPage === totalPages ? styles.pagerBtnDisabled : null,
            ]}
            accessibilityLabel="Next page"
          >
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
