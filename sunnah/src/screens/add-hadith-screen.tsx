"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/dialogs";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/toast";
import { errorMessage } from "@/lib/errors";
import { HADITH_TOPICS } from "@/lib/topics";
import {
  createHadith,
  updateHadith,
  type HadithRecord,
} from "@/services/hadith";

const BOOKS = ["Sahih al-Bukhari", "Sahih Muslim"] as const;
const GRADES = ["Sahih", "Hasan"] as const;
const STEPS = ["Source", "Narration", "Translation"] as const;
const TOTAL_STEPS = STEPS.length;

const emptyForm = {
  book: "",
  hadithNumber: "",
  arabicNumber: "",
  chapter: "",
  referenceBook: "",
  referenceHadith: "",
  narrator: "",
  topic: "",
  grade: [] as string[],
  text: "",
  english: "",
  urdu: "",
  arabic: "",
  description: "",
};

function toForm(hadith: HadithRecord): typeof emptyForm {
  return {
    book: hadith.book,
    hadithNumber: String(hadith.hadithNumber ?? ""),
    arabicNumber: String(hadith.arabicNumber ?? ""),
    chapter: hadith.chapter ?? "",
    referenceBook: String(hadith.reference?.book ?? ""),
    referenceHadith: String(hadith.reference?.hadith ?? ""),
    narrator: hadith.narrator ?? "",
    topic: hadith.topic ?? "",
    grade: hadith.grade ?? [],
    text: hadith.text ?? "",
    english: hadith.translation?.english ?? "",
    urdu: hadith.translation?.urdu ?? "",
    arabic: hadith.translation?.arabic ?? "",
    description: hadith.description ?? "",
  };
}

type AddHadithScreenProps = {
  hadith?: HadithRecord | null;
  onDone?: () => void;
};

export function AddHadithScreen({
  hadith = null,
  onDone,
}: AddHadithScreenProps) {
  const isEdit = Boolean(hadith);
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(hadith ? toForm(hadith) : emptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCurrentStep(1);
    setFormData(hadith ? toForm(hadith) : emptyForm);
  }, [hadith?.id]);

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
    if (step === 1 && (!formData.book || !formData.hadithNumber || !formData.arabicNumber)) {
      toast.show({
        type: "error",
        text1: "Error",
        text2: "Book, Hadith number, and Arabic number are required",
      });
      return false;
    }
    if (step === 2 && (!formData.narrator || !formData.topic || !formData.text)) {
      toast.show({
        type: "error",
        text1: "Error",
        text2: "Narrator, topic, and text are required",
      });
      return false;
    }
    if (step === 3 && !formData.english) {
      toast.show({
        type: "error",
        text1: "Error",
        text2: "English translation is required",
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

  const confirmSave = async () => {
    setSaving(true);
    const payload = {
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
    };
    try {
      if (hadith) await updateHadith(hadith.id, payload);
      else await createHadith(payload);
      setConfirmOpen(false);
      setCurrentStep(1);
      setFormData(emptyForm);
      toast.show({
        type: "success",
        text1: "Success",
        text2: hadith ? "Hadith updated successfully" : "Hadith added successfully",
      });
      onDone?.();
    } catch (err) {
      toast.show({
        type: "error",
        text1: hadith ? "Update failed" : "Add failed",
        text2: errorMessage(err, hadith ? "Could not update Hadith" : "Could not add Hadith"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          {onDone ? (
            <button
              type="button"
              onClick={onDone}
              className="mb-2 text-sm font-semibold text-primary"
            >
              ← Back to list
            </button>
          ) : null}
          <h1 className="text-3xl font-bold text-text">
            {isEdit ? "Edit Hadith" : "Add Hadith"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Source, narration, then translation. Same payload as the app.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex gap-2 border-b border-border px-6 py-4">
        {STEPS.map((label, index) => {
          const active = index + 1 <= currentStep;
          const current = index + 1 === currentStep;
          return (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                current
                  ? "bg-primary text-on-primary"
                  : active
                    ? "bg-accent text-primary"
                    : "text-muted"
              }`}
            >
              <span>{index + 1}</span>
              {label}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-6">
        {currentStep === 1 ? (
          <div>
            <h2 className="mb-6 text-xl font-bold text-text">Source</h2>
            <label className="mb-2 block text-base font-semibold text-text">Book *</label>
            <div className="mb-5 flex gap-2 overflow-x-auto">
              {BOOKS.map((book) => {
                const active = formData.book === book;
                return (
                  <button
                    key={book}
                    type="button"
                    onClick={() => updateFormData("book", book)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                      active
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border bg-card text-muted"
                    }`}
                  >
                    {book}
                  </button>
                );
              })}
            </div>

            <div className="mb-5 flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-base font-semibold text-text">
                  Hadith number *
                </label>
                <input
                  value={formData.hadithNumber}
                  onChange={(event) => updateFormData("hadithNumber", event.target.value)}
                  placeholder="1"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-base font-semibold text-text">
                  Arabic number *
                </label>
                <input
                  value={formData.arabicNumber}
                  onChange={(event) => updateFormData("arabicNumber", event.target.value)}
                  placeholder="1"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
            </div>

            <label className="mb-2 block text-base font-semibold text-text">Chapter</label>
            <input
              value={formData.chapter}
              onChange={(event) => updateFormData("chapter", event.target.value)}
              placeholder="e.g. Revelation"
              className="mb-5 w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-base font-semibold text-text">
                  Reference book
                </label>
                <input
                  value={formData.referenceBook}
                  onChange={(event) => updateFormData("referenceBook", event.target.value)}
                  placeholder="1"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-base font-semibold text-text">
                  Reference hadith
                </label>
                <input
                  value={formData.referenceHadith}
                  onChange={(event) => updateFormData("referenceHadith", event.target.value)}
                  placeholder="1"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div>
            <h2 className="mb-6 text-xl font-bold text-text">Narration</h2>
            <label className="mb-2 block text-base font-semibold text-text">Narrator *</label>
            <input
              value={formData.narrator}
              onChange={(event) => updateFormData("narrator", event.target.value)}
              placeholder="e.g. Umar bin Al-Khattab"
              className="mb-5 w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
            />

            <label className="mb-2 block text-base font-semibold text-text">Topic *</label>
            <div className="mb-5 flex flex-wrap gap-2">
              {HADITH_TOPICS.map((topic) => {
                const active = formData.topic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => updateFormData("topic", topic)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold ${
                      active
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border bg-card text-muted"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            <label className="mb-2 block text-base font-semibold text-text">Grade</label>
            <div className="mb-5 flex flex-wrap gap-2">
              {GRADES.map((grade) => {
                const active = formData.grade.includes(grade);
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => toggleGrade(grade)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold ${
                      active
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border bg-card text-muted"
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>

            <label className="mb-2 block text-base font-semibold text-text">Text *</label>
            <textarea
              value={formData.text}
              onChange={(event) => updateFormData("text", event.target.value)}
              placeholder="I heard Allah's Messenger..."
              rows={5}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text outline-none placeholder:text-muted"
            />
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div>
            <h2 className="mb-6 text-xl font-bold text-text">Translation</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-base font-semibold text-text">English *</label>
                <textarea
                  value={formData.english}
                  onChange={(event) => updateFormData("english", event.target.value)}
                  placeholder="English translation"
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-text">Urdu</label>
                <textarea
                  value={formData.urdu}
                  onChange={(event) => updateFormData("urdu", event.target.value)}
                  placeholder="اردو ترجمہ"
                  rows={4}
                  dir="rtl"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-text">Arabic</label>
                <textarea
                  value={formData.arabic}
                  onChange={(event) => updateFormData("arabic", event.target.value)}
                  placeholder="النص العربي"
                  rows={4}
                  dir="rtl"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-text">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) => updateFormData("description", event.target.value)}
                  placeholder="Explanation, not part of the Hadith"
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none placeholder:text-muted"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
          }}
          disabled={currentStep === 1}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text disabled:text-muted"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
        >
          {currentStep === TOTAL_STEPS ? (isEdit ? "Save Hadith" : "Add Hadith") : "Next"}
          {currentStep < TOTAL_STEPS ? <Icon name="chevron-forward" size={18} /> : null}
        </button>
      </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={isEdit ? "Edit Hadith" : "Add Hadith"}
        message={
          isEdit
            ? "Are you sure you want to save these changes?"
            : "Are you sure you want to add this Hadith?"
        }
        confirming={saving}
        onClose={() => {
          if (!saving) setConfirmOpen(false);
        }}
        onConfirm={() => {
          void confirmSave();
        }}
      />
    </div>
  );
}
