import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrossIcon } from '@/components/CrossIcon';
import { EyeIcon } from '@/components/EyeIcon';
import { HadithListCard } from '@/components/HadithListCard';
import { SearchIcon } from '@/components/SearchIcon';
import { FilterTopicsModal } from '@/modals/FilterTopicsModal';
import HadithDetailScreen from '@/screens/HadithDetailScreen';
import { queryKeys } from '@/query/keys';
import {
  errorMessage,
  getSavedHadiths,
  listUserHadiths,
  saveHadith,
  unsaveHadith,
} from '@/services/hadith';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/adminHadiths';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrentUser } from '@/users/hooks';
import { preferenceNames } from '@/users/preferences';
import type { HadithTopic } from '@/users/preferences';

const PAGE_SIZE = 3;

function pageWindow(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

type SearchScreenProps = {
  onOpenProfile?: () => void;
};

export default function SearchScreen({ onOpenProfile }: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();
  const { data: user } = useCurrentUser();
  const prefs = preferenceNames(user?.preferences ?? []);
  const prefKey = prefs.join('|');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewing, setViewing] = useState<HadithRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced, topic, prefKey]);

  useEffect(() => {
    if (topic && !prefs.includes(topic as HadithTopic)) setTopic('');
  }, [prefKey]);

  const listQuery = useQuery({
    queryKey: queryKeys.hadiths.user(prefKey, topic, debounced, page),
    queryFn: () => listUserHadiths(debounced, topic, page, PAGE_SIZE),
    enabled: Boolean(user),
  });
  const savedQuery = useQuery({
    queryKey: queryKeys.hadiths.saved,
    queryFn: getSavedHadiths,
    enabled: Boolean(user),
  });

  const pageItems = listQuery.data?.hadiths ?? [];
  const totalPages = listQuery.data?.totalPages ?? 1;
  const currentPage = Math.min(page, totalPages);
  const savedIds = new Set((savedQuery.data ?? []).map((item) => item.id));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const saveMutation = useMutation({
    mutationFn: (item: HadithRecord) =>
      savedIds.has(item.id) ? unsaveHadith(item.id) : saveHadith(item.id),
    onSuccess: async (_data, item) => {
      await client.invalidateQueries({ queryKey: queryKeys.hadiths.all });
      const saved = savedIds.has(item.id);
      Toast.show({
        type: 'success',
        text1: saved ? 'Removed' : 'Saved',
        text2: saved
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

  const renderItem = ({ item }: { item: HadithRecord }) => {
    const saved = savedIds.has(item.id);
    return (
      <HadithListCard
        item={item}
        onPress={() => setViewing(item)}
        actions={
          <>
            <TouchableOpacity
              onPress={() => setViewing(item)}
              style={styles.deleteButton}
              accessibilityLabel="View Hadith"
            >
              <EyeIcon size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => saveMutation.mutate(item)}
              style={styles.deleteButton}
              accessibilityLabel={saved ? 'Remove from saved' : 'Save Hadith'}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          </>
        }
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleInRow]}>Hadiths</Text>
          {topic ? (
            <TouchableOpacity
              onPress={() => setTopic('')}
              style={styles.filterBtn}
              accessibilityLabel="Clear filter"
            >
              <Text style={styles.filterBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (!prefs.length) {
                  onOpenProfile?.();
                  return;
                }
                setFilterOpen(true);
              }}
              style={styles.filterBtn}
              accessibilityLabel="Filter by topic"
            >
              <Ionicons name="filter-outline" size={16} color={colors.text} />
              <Text style={styles.filterBtnText}>Filter</Text>
            </TouchableOpacity>
          )}
        </View>
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

      {!prefs.length ? (
        <Text style={styles.empty}>
          Pick up to 3 topics in Profile to see Hadiths for your preferences.
        </Text>
      ) : listQuery.isLoading ? (
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
          extraData={`${debounced}-${topic}-${currentPage}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {topic && !debounced
                ? `Hadith related to ${topic} does not exist`
                : 'No Hadith found'}
            </Text>
          }
        />
      )}

      {!prefs.length ||
      listQuery.isLoading ||
      listQuery.isError ||
      (listQuery.data?.total ?? 0) === 0 ? null : (
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
                  <Text
                    style={[styles.pagerNum, active ? styles.pagerNumActive : null]}
                  >
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

      <FilterTopicsModal
        visible={filterOpen}
        selected={topic}
        topics={prefs}
        onClose={() => setFilterOpen(false)}
        onSelect={(next: HadithTopic) => {
          setTopic(next);
          setFilterOpen(false);
        }}
      />
      <Modal
        visible={Boolean(viewing)}
        animationType="slide"
        onRequestClose={() => setViewing(null)}
      >
        <View
          style={{
            backgroundColor: colors.background,
            flex: 1,
            paddingTop: insets.top,
          }}
        >
          {viewing ? (
            <HadithDetailScreen
              hadith={viewing}
              onBack={() => setViewing(null)}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
