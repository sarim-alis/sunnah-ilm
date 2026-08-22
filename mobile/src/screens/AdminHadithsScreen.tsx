import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { CrossIcon } from '@/components/CrossIcon';
import { EyeIcon } from '@/components/EyeIcon';
import { PencilIcon } from '@/components/PencilIcon';
import { SearchIcon } from '@/components/SearchIcon';
import { TrashIcon } from '@/components/TrashIcon';
import { DeleteHadithModal } from '@/modals/DeleteHadithModal';
import AddHadithScreen from '@/screens/AddHadithScreen';
import HadithDetailScreen from '@/screens/HadithDetailScreen';
import { queryKeys } from '@/query/keys';
import { deleteHadith, errorMessage, listHadiths } from '@/services/hadith';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/adminHadiths';
import { useTheme } from '@/theme/ThemeProvider';

const PAGE_SIZE = 3;

function pageWindow(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

function matchesHadith(item: HadithRecord, term: string) {
  const haystack = [
    item.topic,
    item.narrator,
    item.book,
    String(item.hadithNumber),
    String(item.arabicNumber),
    item.chapter,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(term);
}

export default function AdminHadithsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<HadithRecord | null>(null);
  const [viewing, setViewing] = useState<HadithRecord | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const listQuery = useQuery({
    queryKey: queryKeys.hadiths.admin,
    queryFn: () => listHadiths(),
  });

  const hadiths = useMemo(() => {
    const items = listQuery.data ?? [];
    const term = debounced.toLowerCase();
    if (!term) return items;
    return items.filter((item) => matchesHadith(item, term));
  }, [listQuery.data, debounced]);

  const totalPages = Math.max(1, Math.ceil(hadiths.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = hadiths.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const deleteMutation = useMutation({
    mutationFn: deleteHadith,
    onSuccess: async () => {
      setPendingId(null);
      await client.invalidateQueries({ queryKey: queryKeys.hadiths.all });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Hadith deleted successfully',
      });
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: errorMessage(err, 'Could not delete Hadith'),
      });
    },
  });

  const renderItem = ({ item }: { item: HadithRecord }) => {
    const snippet = item.translation?.english || item.text;
    return (
      <View style={styles.card}>
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
            onPress={() => setEditing(item)}
            style={styles.deleteButton}
            accessibilityLabel="Edit Hadith"
          >
            <PencilIcon size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPendingId(item.id)}
            style={styles.deleteButton}
            accessibilityLabel="Delete Hadith"
          >
            <TrashIcon size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (viewing) {
    return (
      <HadithDetailScreen
        hadith={viewing}
        onBack={() => setViewing(null)}
      />
    );
  }

  if (editing) {
    return (
      <AddHadithScreen
        hadith={editing}
        onDone={() => setEditing(null)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Hadiths</Text>
        <View style={styles.searchWrap}>
          <SearchIcon size={14} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setDebounced('');
                setPage(1);
              }}
              style={styles.searchCross}
              accessibilityLabel="Clear search"
            >
              <CrossIcon size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {listQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : listQuery.isError ? (
        <Text style={styles.empty}>
          {errorMessage(listQuery.error, 'Could not load Hadiths')}
        </Text>
      ) : (
        <FlatList
          data={pageItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={`${debounced}-${currentPage}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No Hadith found</Text>}
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

      <DeleteHadithModal
        visible={Boolean(pendingId)}
        confirming={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) setPendingId(null);
        }}
        onConfirm={() => {
          if (pendingId) void deleteMutation.mutateAsync(pendingId);
        }}
      />
    </View>
  );
}
