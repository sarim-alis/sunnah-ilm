import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { AddHadithModal } from '@/modals/AddHadithModal';
import { queryKeys } from '@/query/keys';
import { createHadith, errorMessage } from '@/services/hadith';
import { createStyles } from '@/styles/screens/addHadith';
import { useTheme } from '@/theme/ThemeProvider';
import { HADITH_TOPICS } from '@/users/preferences';

const BOOKS = ['Sahih al-Bukhari', 'Sahih Muslim'] as const;
const GRADES = ['Sahih', 'Hasan'] as const;
const STEPS = ['Source', 'Narration', 'Translation'] as const;
const TOTAL_STEPS = STEPS.length;

const emptyForm = {
  book: '',
  hadithNumber: '',
  arabicNumber: '',
  chapter: '',
  referenceBook: '',
  referenceHadith: '',
  narrator: '',
  topic: '',
  grade: [] as string[],
  text: '',
  english: '',
  urdu: '',
  arabic: '',
  description: '',
};

export default function AddHadithScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(emptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateFormData = <K extends keyof typeof emptyForm>(
    field: K,
    value: (typeof emptyForm)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGrade = (grade: string) => {
    setFormData((prev) => ({
      ...prev,
      grade: prev.grade.includes(grade)
        ? prev.grade.filter((item) => item !== grade)
        : [...prev.grade, grade],
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.book || !formData.hadithNumber || !formData.arabicNumber) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Book, Hadith number, and Arabic number are required',
        });
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.narrator || !formData.topic || !formData.text) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Narrator, topic, and text are required',
        });
        return false;
      }
      return true;
    }
    if (step === 3 && !formData.english) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'English translation is required',
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      return;
    }
    setConfirmOpen(true);
  };

  const confirmAdd = async () => {
    setSaving(true);
    try {
      await createHadith({
        book: formData.book,
        hadithNumber: Number(formData.hadithNumber),
        arabicNumber: Number(formData.arabicNumber),
        translation: {
          english: formData.english.trim(),
          urdu: formData.urdu.trim(),
          arabic: formData.arabic.trim(),
        },
        narrator: formData.narrator.trim(),
        grade: formData.grade,
        topic: formData.topic,
        chapter: formData.chapter.trim(),
        reference: {
          book: Number(formData.referenceBook) || 0,
          hadith: Number(formData.referenceHadith) || 0,
        },
        text: formData.text.trim(),
        description: formData.description.trim(),
      });
      await client.invalidateQueries({ queryKey: queryKeys.hadiths.all });
      setConfirmOpen(false);
      setCurrentStep(1);
      setFormData(emptyForm);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Hadith added successfully',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Add failed',
        text2: errorMessage(err, 'Could not add Hadith'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Hadith</Text>
      </View>

      <View style={styles.stepIndicator}>
        {STEPS.map((label, index) => {
          const active = index + 1 <= currentStep;
          return (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepCircle, active ? styles.stepCircleActive : null]}>
                <Text style={[styles.stepNumber, active ? styles.stepNumberActive : null]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, active ? styles.stepLabelActive : null]}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 ? (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Source</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Book *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {BOOKS.map((book) => {
                  const active = formData.book === book;
                  return (
                    <TouchableOpacity
                      key={book}
                      style={[styles.chip, active ? styles.chipActive : null]}
                      onPress={() => updateFormData('book', book)}
                    >
                      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                        {book}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8, marginBottom: 0 }]}>
                <Text style={styles.inputLabel}>Hadith number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.hadithNumber}
                  onChangeText={(value) => updateFormData('hadithNumber', value)}
                  placeholder="1"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8, marginBottom: 0 }]}>
                <Text style={styles.inputLabel}>Arabic number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.arabicNumber}
                  onChangeText={(value) => updateFormData('arabicNumber', value)}
                  placeholder="1"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chapter</Text>
              <TextInput
                style={styles.textInput}
                value={formData.chapter}
                onChangeText={(value) => updateFormData('chapter', value)}
                placeholder="e.g. Revelation"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8, marginBottom: 0 }]}>
                <Text style={styles.inputLabel}>Reference book</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.referenceBook}
                  onChangeText={(value) => updateFormData('referenceBook', value)}
                  placeholder="1"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8, marginBottom: 0 }]}>
                <Text style={styles.inputLabel}>Reference hadith</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.referenceHadith}
                  onChangeText={(value) => updateFormData('referenceHadith', value)}
                  placeholder="1"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ) : null}

        {currentStep === 2 ? (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Narration</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Narrator *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.narrator}
                onChangeText={(value) => updateFormData('narrator', value)}
                placeholder="e.g. Umar bin Al-Khattab"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Topic *</Text>
              <View style={styles.chipWrap}>
                {HADITH_TOPICS.map((topic) => {
                  const active = formData.topic === topic;
                  return (
                    <TouchableOpacity
                      key={topic}
                      style={[styles.wrapChip, active ? styles.chipActive : null]}
                      onPress={() => updateFormData('topic', topic)}
                    >
                      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                        {topic}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grade</Text>
              <View style={styles.chipWrap}>
                {GRADES.map((grade) => {
                  const active = formData.grade.includes(grade);
                  return (
                    <TouchableOpacity
                      key={grade}
                      style={[styles.wrapChip, active ? styles.chipActive : null]}
                      onPress={() => toggleGrade(grade)}
                    >
                      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Text *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.text}
                onChangeText={(value) => updateFormData('text', value)}
                placeholder="I heard Allah's Messenger..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
          </View>
        ) : null}

        {currentStep === 3 ? (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Translation</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>English *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.english}
                onChangeText={(value) => updateFormData('english', value)}
                placeholder="English translation"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Urdu</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.urdu}
                onChangeText={(value) => updateFormData('urdu', value)}
                placeholder="اردو ترجمہ"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Arabic</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.arabic}
                onChangeText={(value) => updateFormData('arabic', value)}
                placeholder="النص العربي"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="Explanation, not part of the Hadith"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.backButton]}
          onPress={handleBack}
          disabled={currentStep === 1}
        >
          <Text
            style={[
              styles.actionButtonText,
              currentStep === 1 ? styles.actionButtonTextDisabled : null,
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === TOTAL_STEPS ? 'Add Hadith' : 'Next'}
          </Text>
          {currentStep < TOTAL_STEPS ? (
            <Ionicons name="chevron-forward" size={20} color={colors.onPrimary} />
          ) : null}
        </TouchableOpacity>
      </View>
      <AddHadithModal
        visible={confirmOpen}
        confirming={saving}
        onClose={() => {
          if (!saving) setConfirmOpen(false);
        }}
        onConfirm={() => {
          void confirmAdd();
        }}
      />
    </KeyboardAvoidingView>
  );
}
