"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/auth-provider";
import { ConfirmDialog } from "@/components/dialogs";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/toast";
import { errorMessage } from "@/lib/errors";

export function ProfileScreen() {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) return null;

  const imageUri = user.imageUrl ?? null;
  const initial = user.name.charAt(0).toUpperCase();

  const onPickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      await updateProfile({ name: user.name, email: user.email, image: file });
      toast.show({ type: "success", text1: "Success", text2: "Photo updated" });
    } catch (err) {
      toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMessage(err, "Could not update profile"),
      });
    } finally {
      setUploading(false);
    }
  };

  const saveDetails = async () => {
    if (!name.trim() || !email.trim()) {
      toast.show({ type: "error", text1: "Error", text2: "Name and email are required" });
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setEditOpen(false);
      toast.show({ type: "success", text1: "Success", text2: "Profile updated" });
    } catch (err) {
      toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMessage(err, "Could not update profile"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Profile</h1>
          <p className="mt-1 text-sm text-muted">Account for this admin.</p>
        </div>
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text"
        >
          <Icon name="logout" size={18} />
          Log out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="relative mx-auto h-28 w-28">
          <button
            type="button"
            onClick={() => {
              if (imageUri) setViewOpen(true);
              else fileRef.current?.click();
            }}
            className="h-28 w-28 overflow-hidden rounded-[22px] border-[3px] border-border bg-card"
          >
            {imageUri ? (
              <img src={imageUri} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center bg-accent text-4xl font-bold text-primary">
                {initial}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-primary"
            aria-label="Change photo"
          >
            {uploading ? "…" : <Icon name="pencil" size={14} />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void onPickPhoto(file);
            }}
          />
        </div>

        <p className="mt-4 text-xl font-bold text-text">{user.name}</p>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </section>

        <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Account</h2>
            <button
              type="button"
              onClick={() => {
                setName(user.name);
                setEmail(user.email);
                setEditOpen(true);
              }}
              className="text-primary"
              aria-label="Edit profile"
            >
              <Icon name="pencil" size={22} />
            </button>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon name="person-outline" size={18} />
            </span>
            <div>
              <p className="text-xs text-muted">Name</p>
              <p className="text-base font-semibold text-text">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-border text-muted">
              <Icon name="mail" size={18} />
            </span>
            <div>
              <p className="text-xs text-muted">Email Address</p>
              <p className="text-base font-semibold text-text">{user.email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-error/30 bg-card p-6">
          <p className="font-bold text-error">Delete account</p>
          <p className="mt-1 text-sm text-muted">
            Remove your Sunnah-Ilm account, profile photo, preferences, and saved
            Ahadees. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-3 min-h-11 rounded-xl bg-error px-4 text-sm font-semibold text-on-primary"
          >
            Delete account
          </button>
        </section>
        </div>
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-[#151515]/45"
            onClick={() => setEditOpen(false)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-card px-5 py-5">
            <div className="mb-4 flex items-center">
              <div className="w-8" />
              <h2 className="flex-1 text-center text-xl font-bold text-text">Edit profile</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex w-8 justify-end text-error"
                aria-label="Close"
              >
                <Icon name="close" size={28} />
              </button>
            </div>
            <label className="mb-2 block text-sm font-semibold text-text">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none"
            />
            <label className="mb-2 block text-sm font-semibold text-text">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mb-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-text outline-none"
            />
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                void saveDetails();
              }}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-on-primary"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : null}

      {viewOpen && imageUri ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#151515]/80 px-6">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setViewOpen(false)}
            aria-label="Close"
          />
          <img
            src={imageUri}
            alt=""
            className="relative max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      ) : null}

      <ConfirmDialog
        open={logoutOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        confirming={loggingOut}
        confirmLabel="Log out"
        onClose={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={() => {
          void (async () => {
            setLoggingOut(true);
            try {
              await logout();
              router.replace("/login");
            } catch (err) {
              setLoggingOut(false);
              toast.show({
                type: "error",
                text1: "Logout failed",
                text2: errorMessage(err, "Cannot log out"),
              });
            }
          })();
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete account"
        message="This cannot be undone. Delete your account?"
        confirming={deleting}
        confirmLabel="Delete"
        destructive
        onClose={() => {
          if (!deleting) setDeleteOpen(false);
        }}
        onConfirm={() => {
          void (async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              router.replace("/login");
            } catch (err) {
              setDeleting(false);
              toast.show({
                type: "error",
                text1: "Delete failed",
                text2: errorMessage(err, "Could not delete account"),
              });
            }
          })();
        }}
      />
    </div>
  );
}
