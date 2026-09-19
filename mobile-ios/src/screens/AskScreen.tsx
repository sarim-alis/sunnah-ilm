import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { EyeIcon } from '@/components/EyeIcon';
import { MarkdownBoldText } from '@/components/MarkdownBoldText';
import { HadithListCard } from '@/components/HadithListCard';
import HadithDetailScreen from '@/screens/HadithDetailScreen';
import { AskHintsModal } from '@/modals/AskHintsModal';
import { AskLoadingModal } from '@/modals/AskLoadingModal';
import { errorMessage } from '@/services/auth';
import { askHadith, friendlyAskError, type AskHadithResult } from '@/services/ai';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/AskScreen';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrentUser } from '@/users/hooks';
import { preferenceImage } from '@/users/preferenceImages';
import askTopicHints from '@/data/ask-topic-hints.json';
import { preferenceNames } from '@/users/preferences';
import type { HadithTopic } from '@/users/preferences';

const TOPIC_HINTS = askTopicHints as Record<HadithTopic, string[]>;

type AskScreenProps = {
  onOpenProfile?: () => void;
};

export default function AskScreen({ onOpenProfile }: AskScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: user } = useCurrentUser();
  const prefs = preferenceNames(user?.preferences ?? []);
  const [topic, setTopic] = useState<HadithTopic | ''>('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<AskHadithResult | null>(null);
  const [viewing, setViewing] = useState<HadithRecord | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);

  const askMutation = useMutation({
    mutationFn: () => {
      if (!topic) throw new Error('Pick a topic first');
      return askHadith(topic, question);
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: 'Ask failed',
        text2: friendlyAskError(errorMessage(err, 'Could not get an answer')),
      });
    },
  });

  const canAsk = Boolean(topic && question.trim().length >= 3);
  const topicHints = topic ? TOPIC_HINTS[topic] ?? [] : [];
  const placeholder =
    topicHints[0] ?? (topic ? `Ask anything about ${topic}…` : 'Select a topic above first');

  const submit = () => {
    if (!canAsk || askMutation.isPending) return;
    void askMutation.mutateAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Ask Hadith</Text>
        <Text style={styles.subtitle}>
          Pick one of your saved topics, then ask in your own words. Answers use
          verified Ahadees from our corpus — never invented text.
        </Text>

        <Text style={styles.sectionLabel}>1. Choose a topic</Text>
        {!prefs.length ? (
          <>
            <Text style={styles.emptyPrefs}>
              Save up to 3 topics in Profile first, then you can ask about any of
              them here.
            </Text>
            {onOpenProfile ? (
              <TouchableOpacity onPress={onOpenProfile} style={styles.pickBtn}>
                <Text style={styles.pickText}>Go to Profile</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <View style={styles.chips}>
            {prefs.map((name) => {
              const active = topic === name;
              const source = preferenceImage(name);
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => {
                    if (topic !== name) {
                      setQuestion('');
                      setResult(null);
                      setHintsOpen(false);
                    }
                    setTopic(name);
                  }}
                  style={[styles.chip, active ? styles.chipOn : null]}
                  activeOpacity={0.85}
                >
                  {source ? (
                    <Image source={source} style={styles.chipIcon} resizeMode="contain" />
                  ) : null}
                  <Text style={[styles.chipText, active ? styles.chipTextOn : null]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.questionHeader}>
          <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>
            2. Ask your question
          </Text>
          {topic && topicHints.length > 0 ? (
            <TouchableOpacity
              onPress={() => setHintsOpen(true)}
              style={styles.hintBtn}
              accessibilityLabel="Show question suggestions"
              activeOpacity={0.85}
            >
              <Image
                source={require('../../public/hint.png')}
                style={styles.hintIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
            editable={Boolean(topic)}
          />
        </View>

        <TouchableOpacity
          onPress={submit}
          disabled={!canAsk || askMutation.isPending}
          style={[
            styles.askBtn,
            !canAsk || askMutation.isPending ? styles.askBtnDisabled : null,
          ]}
          activeOpacity={0.9}
        >
          <Text style={styles.askBtnText}>Ask</Text>
        </TouchableOpacity>

        {result ? (
          <>
            {result.explanation ? (
              <View style={styles.explanationCard}>
                <Text style={styles.explanationLabel}>Explanation</Text>
                <MarkdownBoldText style={styles.explanationText}>
                  {result.explanation}
                </MarkdownBoldText>
              </View>
            ) : null}

            {result.hadiths.length > 0 ? (
              <>
                <Text style={styles.resultsHead}>
                  Retrieved narrations ({result.hadiths.length})
                </Text>
                <View style={styles.list}>
                  {result.hadiths.map((item) => (
                    <HadithListCard
                      key={item.id}
                      item={item}
                      onPress={() => setViewing(item)}
                      actions={
                        <TouchableOpacity
                          onPress={() => setViewing(item)}
                          style={{
                            alignItems: 'center',
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            borderRadius: 18,
                            borderWidth: 1,
                            height: 36,
                            justifyContent: 'center',
                            width: 36,
                          }}
                          accessibilityLabel="View Hadith"
                        >
                          <EyeIcon size={16} color={colors.text} />
                        </TouchableOpacity>
                      }
                    />
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      <AskLoadingModal visible={askMutation.isPending} />

      {topic && topicHints.length > 0 ? (
        <AskHintsModal
          visible={hintsOpen}
          topic={topic}
          hints={topicHints}
          onClose={() => setHintsOpen(false)}
          onSelect={(hint) => {
            setQuestion(hint);
            setHintsOpen(false);
          }}
        />
      ) : null}

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
            <HadithDetailScreen hadith={viewing} onBack={() => setViewing(null)} />
          ) : null}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
