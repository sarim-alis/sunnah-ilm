import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete your account — Sunnah-Ilm",
  description:
    "How to delete your Sunnah-Ilm account and what data is removed.",
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-on-primary">
            S
          </span>
          <div>
            <p className="text-base font-bold text-text">Sunnah-Ilm</p>
            <p className="text-xs text-muted">Developer: Sarim Ali</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-6 pb-16">
        <section className="relative overflow-hidden rounded-3xl bg-accent px-5 py-6">
          <div className="absolute -top-10 -right-6 h-40 w-40 rounded-full bg-secondary/20" />
          <div className="absolute top-12 right-10 h-24 w-24 rounded-full bg-secondary/20" />
          <div className="relative">
            <p className="text-sm font-semibold text-primary">Account</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-text">
              Delete your account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Sunnah-Ilm by Sarim Ali
            </p>
          </div>
        </section>

        <article className="rounded-3xl border border-border bg-card px-5 py-6 shadow-sm">
          <p className="text-base leading-7 text-text">
            This page is for <strong>Sunnah-Ilm</strong>, published on Google
            Play by developer <strong>Sarim Ali</strong>. Use the steps below to request that
            your account and associated personal data are deleted.
          </p>

          <h2 className="mt-8 text-lg font-bold text-primary">
            How to delete your account
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-7 text-text">
            <li>Open the Sunnah-Ilm app by Sarim Ali on your phone.</li>
            <li>Sign in with the email and password for the account you want removed.</li>
            <li>Go to <strong>Profile</strong>.</li>
            <li>Scroll to the bottom and tap <strong>Delete account</strong>.</li>
            <li>Confirm. Deletion starts immediately and cannot be undone.</li>
          </ol>
          <p className="mt-4 text-base leading-7 text-text">
            If you cannot open the app, email developer <strong>Sarim Ali</strong>{" "}
            at{" "}
            <a
              className="font-semibold text-primary underline"
              href="mailto:sarimslayerali786@gmail.com"
            >
              sarimslayerali786@gmail.com
            </a>{" "}
            from the same email as your account, and ask to delete it. Sarim Ali
            will process that request.
          </p>

          <h2 className="mt-8 text-lg font-bold text-primary">
            Data we delete
          </h2>
          <p className="mt-3 text-base leading-7 text-text">
            When you delete your account we remove, without a waiting period:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-text">
            <li>Name, email, and password</li>
            <li>Profile photo</li>
            <li>Topic preferences and display mode</li>
            <li>Saved / bookmarked Ahadees</li>
            <li>The sign-in token stored on your device (cleared when you confirm in the app)</li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-primary">
            Data we keep
          </h2>
          <p className="mt-3 text-base leading-7 text-text">
            We keep a non-identifying internal record (an anonymized ID and the
            deletion time) so the account cannot be restored. We do not keep
            your name, email, photo, or bookmarks. The Hadith texts in Sunnah-Ilm
            are a shared corpus, not your personal data, and they stay in the
            app for other users.
          </p>

          <p className="mt-8 text-sm text-muted">
            See also the{" "}
            <Link href="/privacy" className="font-semibold text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
