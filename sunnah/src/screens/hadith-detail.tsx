"use client";

import { Icon } from "@/components/icon";
import type { HadithRecord } from "@/services/hadith";

function Field({
  label,
  value,
  rtl,
  grow,
}: {
  label: string;
  value?: string | number | null;
  rtl?: boolean;
  grow?: boolean;
}) {
  const text = value === 0 || value ? String(value) : "";
  return (
    <div className={grow ? "mb-3 flex-1" : "mb-3"}>
      <p className="mb-1 text-sm font-semibold text-text">{label}</p>
      <div className="rounded-[10px] border border-border bg-card px-3 py-2">
        <p
          className={`text-sm leading-5 ${text ? "text-text" : "text-muted"} ${rtl ? "text-right" : ""}`}
        >
          {text || "—"}
        </p>
      </div>
    </div>
  );
}

type HadithDetailProps = {
  hadith: HadithRecord;
  onBack: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
};

export function HadithDetail({
  hadith,
  onBack,
  saved = false,
  onToggleSave,
}: HadithDetailProps) {
  const grades = hadith.grade?.filter(Boolean) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 text-sm font-semibold text-primary"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-text">{hadith.book || "Hadith"}</h1>
        </div>
        {onToggleSave ? (
          <button
            type="button"
            onClick={onToggleSave}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary"
            aria-label={saved ? "Remove from saved" : "Save Hadith"}
          >
            <Icon name={saved ? "bookmark" : "bookmark-outline"} size={18} />
            {saved ? "Saved" : "Save"}
          </button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Hadith no" value={hadith.hadithNumber} />
          <Field label="Arabic no" value={hadith.arabicNumber} />
          <Field label="Chapter" value={hadith.chapter} />
          <Field label="Narration" value={hadith.narrator} />
        </div>

        <div className="mb-3">
          <p className="mb-1 text-sm font-semibold text-text">Topic</p>
          {hadith.topic ? (
            <span className="inline-block rounded-2xl border border-border bg-card px-3 py-1 text-[13px] font-semibold text-text">
              {hadith.topic}
            </span>
          ) : (
            <div className="rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-muted">
              —
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="mb-1 text-sm font-semibold text-text">Grade</p>
          {grades.length ? (
            <div className="flex flex-wrap gap-2">
              {grades.map((grade) => (
                <span
                  key={grade}
                  className="rounded-2xl border border-border bg-card px-3 py-1 text-[13px] font-semibold text-text"
                >
                  {grade}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-muted">
              —
            </div>
          )}
        </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="English" value={hadith.translation?.english} />
              <Field label="Urdu" value={hadith.translation?.urdu} rtl />
              <Field label="Arabic" value={hadith.translation?.arabic} rtl />
              <Field label="Text" value={hadith.text} />
            </div>
            <Field label="Description" value={hadith.description} />
      </div>
    </div>
  );
}
