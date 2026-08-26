"use client";

import { useEffect, useState } from "react";
import { HadithTable, IconButton, Pager } from "@/components/hadith-card";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/toast";
import { errorMessage } from "@/lib/errors";
import { HadithDetail } from "@/screens/hadith-detail";
import {
  getSavedHadiths,
  unsaveHadith,
  type HadithRecord,
} from "@/services/hadith";

const PAGE_SIZE = 10;

export function SavedScreen() {
  const toast = useToast();
  const [items, setItems] = useState<HadithRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<HadithRecord | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getSavedHadiths());
    } catch (err) {
      setError(errorMessage(err, "Could not load saved Hadiths"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const remove = async (id: string) => {
    try {
      await unsaveHadith(id);
      toast.show({
        type: "success",
        text1: "Removed",
        text2: "Hadith removed from bookmarks",
      });
      await load();
      if (viewing?.id === id) setViewing(null);
    } catch (err) {
      toast.show({
        type: "error",
        text1: "Failed",
        text2: errorMessage(err, "Could not remove Hadith"),
      });
    }
  };

  if (viewing) {
    return (
      <HadithDetail
        hadith={viewing}
        onBack={() => setViewing(null)}
        saved
        onToggleSave={() => {
          void remove(viewing.id);
        }}
      />
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-text">Saved</h1>
        <p className="mt-1 text-sm text-muted">Bookmarks for this admin account.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="px-6 py-16 text-center text-sm text-muted">Loading…</p>
        ) : error ? (
          <p className="px-6 py-16 text-center text-sm text-muted">{error}</p>
        ) : (
          <HadithTable
            items={pageItems}
            empty="No saved Hadiths yet"
            actions={(item) => (
              <>
                <IconButton label="View Hadith" onClick={() => setViewing(item)}>
                  <Icon name="eye" size={16} />
                </IconButton>
                <IconButton
                  label="Remove from saved"
                  onClick={() => {
                    void remove(item.id);
                  }}
                >
                  <span className="text-primary">
                    <Icon name="bookmark" size={16} />
                  </span>
                </IconButton>
              </>
            )}
          />
        )}
        {loading || error || items.length === 0 ? null : (
          <Pager current={currentPage} total={totalPages} onChange={setPage} />
        )}
      </div>
    </div>
  );
}
