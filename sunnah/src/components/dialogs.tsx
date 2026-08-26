"use client";

import { Icon } from "@/components/icon";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirming?: boolean;
  confirmLabel?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirming = false,
  confirmLabel = "Confirm",
  destructive = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-9">
      <button
        type="button"
        className="absolute inset-0 bg-[#151515]/45"
        onClick={() => {
          if (!confirming) onClose();
        }}
        aria-label="Close"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-card px-5 py-6">
        <p className="text-center text-lg font-bold text-text">{title}</p>
        <p className="mt-2.5 text-center text-[15px] leading-6 text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={confirming}
            onClick={onClose}
            className="min-h-12 flex-1 rounded-xl border border-border bg-background text-base font-semibold text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={confirming}
            onClick={onConfirm}
            className={`min-h-12 flex-1 rounded-xl text-base font-bold text-on-primary ${
              destructive ? "bg-error" : "bg-primary"
            }`}
          >
            {confirming ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterTopicsDialogProps = {
  open: boolean;
  selected?: string;
  topics: readonly string[];
  onClose: () => void;
  onSelect: (topic: string) => void;
};

export function FilterTopicsDialog({
  open,
  selected,
  topics,
  onClose,
  onSelect,
}: FilterTopicsDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#151515]/45"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative max-h-[84%] w-full max-w-md overflow-y-auto rounded-2xl bg-card px-5 pb-4 pt-4">
        <div className="mb-4 flex items-center">
          <div className="w-8" />
          <h2 className="flex-1 text-center text-2xl font-bold text-text">Topics</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex w-8 justify-end text-error"
            aria-label="Close"
          >
            <Icon name="close" size={28} />
          </button>
        </div>
        <div className="flex flex-wrap justify-between gap-y-2">
          {topics.map((topic) => {
            const active = selected === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onSelect(topic)}
                className={`w-[48.5%] rounded-[18px] border px-2.5 py-2.5 text-sm font-semibold ${
                  active
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-background text-text"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
