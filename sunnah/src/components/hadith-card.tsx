"use client";

import type { HadithRecord } from "@/services/hadith";

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-card"
    >
      {children}
    </button>
  );
}

export function Pager({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const windowPages = pageWindow(current, total);
  return (
    <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(Math.max(1, current - 1))}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
      >
        Previous
      </button>
      {windowPages.map((number) => {
        const active = number === current;
        return (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            className={`h-9 w-9 rounded-lg border text-sm font-bold ${
              active
                ? "border-primary bg-primary text-on-primary"
                : "border-border text-text"
            }`}
          >
            {number}
          </button>
        );
      })}
      <button
        type="button"
        disabled={current === total}
        onClick={() => onChange(Math.min(total, current + 1))}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function pageWindow(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

export function HadithTable({
  items,
  empty,
  actions,
}: {
  items: HadithRecord[];
  empty: string;
  actions: (item: HadithRecord) => React.ReactNode;
}) {
  if (items.length === 0) {
    return <p className="px-6 py-16 text-center text-sm text-muted">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            <th className="px-5 py-3">Source</th>
            <th className="px-5 py-3">Topic</th>
            <th className="px-5 py-3">Narrator</th>
            <th className="px-5 py-3">Preview</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const snippet = item.translation?.english || item.text;
            return (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4 align-top">
                  <p className="font-semibold text-text">{item.book}</p>
                  <p className="text-muted">#{item.hadithNumber}</p>
                </td>
                <td className="px-5 py-4 align-top text-text">{item.topic || "—"}</td>
                <td className="px-5 py-4 align-top text-text">{item.narrator}</td>
                <td className="max-w-sm px-5 py-4 align-top text-muted">
                  <p className="line-clamp-2">{snippet}</p>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex justify-end gap-2">{actions(item)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
