"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConfirmDialog, FilterTopicsDialog } from "@/components/dialogs";
import { HadithTable, IconButton, Pager } from "@/components/hadith-card";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/toast";
import { errorMessage } from "@/lib/errors";
import { HADITH_TOPICS } from "@/lib/topics";
import { AddHadithScreen } from "@/screens/add-hadith-screen";
import { HadithDetail } from "@/screens/hadith-detail";
import {
  deleteHadith,
  getSavedHadiths,
  listHadiths,
  saveHadith,
  unsaveHadith,
  type HadithRecord,
} from "@/services/hadith";

const PAGE_SIZE = 3;

export function HadithsScreen() {
  const toast = useToast();
  const [items, setItems] = useState<HadithRecord[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [topic, setTopic] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState<HadithRecord | null>(null);
  const [viewing, setViewing] = useState<HadithRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced, topic]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listHadiths(debounced, topic, page, PAGE_SIZE);
      setItems(result.hadiths);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(errorMessage(err, "Could not load Hadiths"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [topic, debounced, page]);

  useEffect(() => {
    void getSavedHadiths()
      .then((saved) => setSavedIds(saved.map((item) => item.id)))
      .catch(() => setSavedIds([]));
  }, []);

  if (editing) {
    return (
      <AddHadithScreen
        hadith={editing}
        onDone={() => {
          setEditing(null);
          void load();
        }}
      />
    );
  }

  if (viewing) {
    const saved = savedIds.includes(viewing.id);
    return (
      <HadithDetail
        hadith={viewing}
        onBack={() => setViewing(null)}
        saved={saved}
        onToggleSave={() => {
          void (async () => {
            try {
              if (saved) await unsaveHadith(viewing.id);
              else await saveHadith(viewing.id);
              setSavedIds((ids) =>
                saved ? ids.filter((id) => id !== viewing.id) : [...ids, viewing.id],
              );
              toast.show({
                type: "success",
                text1: saved ? "Removed" : "Saved",
                text2: saved
                  ? "Hadith removed from bookmarks"
                  : "Hadith saved to bookmarks",
              });
            } catch (err) {
              toast.show({
                type: "error",
                text1: "Failed",
                text2: errorMessage(err, "Could not update saved Hadith"),
              });
            }
          })();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Hadiths</h1>
          <p className="mt-1 text-sm text-muted">
            {total} {total === 1 ? "narration" : "narrations"} · 3 per page from the server
          </p>
        </div>
        <div className="flex items-center gap-3">
          {topic ? (
            <button
              type="button"
              onClick={() => setTopic("")}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text"
            >
              Clear {topic}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text"
            >
              <Icon name="filter" size={16} />
              Filter
            </button>
          )}
          <Link
            href="/add"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            <Icon name="add" size={16} />
            Add Hadith
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Icon name="search" size={18} className="text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search book, narrator, topic, number…"
            className="h-10 flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-muted"
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebounced("");
                setPage(1);
              }}
              aria-label="Clear search"
            >
              <Icon name="close" size={16} />
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="px-6 py-16 text-center text-sm text-muted">Loading…</p>
        ) : error ? (
          <p className="px-6 py-16 text-center text-sm text-muted">{error}</p>
        ) : (
          <HadithTable
            items={items}
            empty={
              topic && !debounced
                ? `Hadith related to ${topic} does not exist`
                : "No Hadith found"
            }
            actions={(item) => (
              <>
                <IconButton label="View Hadith" onClick={() => setViewing(item)}>
                  <Icon name="eye" size={16} />
                </IconButton>
                <IconButton label="Edit Hadith" onClick={() => setEditing(item)}>
                  <span className="text-primary">
                    <Icon name="pencil" size={16} />
                  </span>
                </IconButton>
                <IconButton label="Delete Hadith" onClick={() => setPendingId(item.id)}>
                  <span className="text-error">
                    <Icon name="trash" size={18} />
                  </span>
                </IconButton>
              </>
            )}
          />
        )}

        {loading || error || total === 0 ? null : (
          <Pager current={page} total={totalPages} onChange={setPage} />
        )}
      </div>

      <FilterTopicsDialog
        open={filterOpen}
        selected={topic}
        topics={HADITH_TOPICS}
        onClose={() => setFilterOpen(false)}
        onSelect={(next) => {
          setTopic(next);
          setFilterOpen(false);
        }}
      />
      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Delete Hadith"
        message="Are you sure you want to delete this Hadith?"
        confirming={deleting}
        destructive
        onClose={() => {
          if (!deleting) setPendingId(null);
        }}
        onConfirm={() => {
          if (!pendingId) return;
          void (async () => {
            setDeleting(true);
            try {
              await deleteHadith(pendingId);
              setPendingId(null);
              toast.show({
                type: "success",
                text1: "Success",
                text2: "Hadith deleted successfully",
              });
              await load();
            } catch (err) {
              toast.show({
                type: "error",
                text1: "Delete failed",
                text2: errorMessage(err, "Could not delete Hadith"),
              });
            } finally {
              setDeleting(false);
            }
          })();
        }}
      />
    </div>
  );
}
