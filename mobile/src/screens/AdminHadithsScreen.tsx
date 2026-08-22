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

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

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
          <SearchIcon size={18} color={colors.textMuted} />
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
          data={hadiths}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={debounced}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No Hadith found</Text>}
        />
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
