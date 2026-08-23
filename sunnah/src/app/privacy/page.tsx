import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Sunnah-Ilm",
  description:
    "How Sunnah-Ilm collects, uses, and stores account and profile data.",
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "Information we collect",
    body: (
      <>
        <p>We collect only what is needed to run your account and the app:</p>
        <ul>
          <li>
            <strong>Account:</strong> name, email address, and password.
            Passwords are stored hashed, not in plain text.
          </li>
          <li>
            <strong>Profile photo (optional):</strong> if you choose one, we
            read a photo from your camera or gallery and store it so it can
            appear on your profile.
          </li>
          <li>
            <strong>Preferences:</strong> Hadith topics you select (up to three)
            and light/dark display mode.
          </li>
          <li>
            <strong>Saved Ahadees:</strong> bookmarks of narrations you save in
            the app.
          </li>
          <li>
            <strong>On-device data:</strong> a sign-in token and a cached copy of
            your profile on your phone so you stay logged in.
          </li>
        </ul>
        <p>
          We do not collect precise location, contacts, SMS, or advertising IDs.
          We do not use third-party analytics or advertising SDKs in the app.
        </p>
      </>
    ),
  },
  {
    title: "How we use this information",
    body: (
      <ul>
        <li>Create and authenticate your account</li>
        <li>Show your profile, photo, and topic preferences</li>
        <li>Save and load your bookmarked Ahadees</li>
        <li>Remember light or dark mode</li>
        <li>Provide customer support if you contact us about your account</li>
      </ul>
    ),
  },
  {
    title: "Permissions",
    body: (
      <p>
        The app may ask for <strong>camera</strong> and <strong>photos</strong>{" "}
        access only so you can set a profile picture. You can refuse those
        permissions and still use the rest of the app.
      </p>
    ),
  },
  {
    title: "Where data is stored",
    body: (
      <>
        <ul>
          <li>
            Account, preferences, and saved Ahadees are stored on our servers
            (hosted on Render) in a PostgreSQL database.
          </li>
          <li>
            Profile photos are stored with Cloudinary, which hosts the image
            file and gives us a URL to display it.
          </li>
          <li>
            Your sign-in token is stored locally on your device until you log
            out.
          </li>
        </ul>
        <p>
          These providers process data only to host the app. They are not given
          your data for their own marketing.
        </p>
      </>
    ),
  },
  {
    title: "Sharing",
    body: (
      <p>
        We do not sell, rent, or share your personal information with third
        parties for advertising. We may disclose information if required by law,
        or to protect the security of the service.
      </p>
    ),
  },
  {
    title: "Retention and deletion",
    body: (
      <p>
        We keep your account data while your account exists. You can log out at
        any time, which removes the token stored on your device. To correct or
        delete your account and associated data (profile, photo, preferences,
        and saved Ahadees), contact us using the email address on the Sunnah-Ilm
        Google Play store listing and tell us the email used to register. We
        will delete that data unless we must keep a limited record to comply
        with law.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        We use HTTPS, hashed passwords, and signed login tokens. No method of
        transmission is completely secure, so please choose a strong password
        and do not share your account.
      </p>
    ),
  },
  {
    title: "Children",
    body: (
      <p>
        Sunnah-Ilm is not directed at children under 13. We do not knowingly
        collect personal information from children under 13. If you believe a
        child has created an account, contact us and we will delete it.
      </p>
    ),
  },
  {
    title: "Changes",
    body: (
      <p>
        We may update this policy. The “Last updated” date at the top will
        change when we do. Continued use of the app after an update means you
        accept the revised policy.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        For privacy questions, access, or deletion requests, use the developer
        contact email on the Sunnah-Ilm listing on Google Play, and include the
        email address on your account.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-on-primary">
            S
          </span>
          <div>
            <p className="text-base font-bold text-text">Sunnah-Ilm</p>
            <p className="text-xs text-muted">Ask &amp; discover Ahadees</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-6 pb-16">
        <section className="relative overflow-hidden rounded-3xl bg-accent px-5 py-6">
          <div className="absolute -top-10 -right-6 h-40 w-40 rounded-full bg-secondary/20" />
          <div className="absolute top-12 right-10 h-24 w-24 rounded-full bg-secondary/20" />
          <div className="relative">
            <p className="text-sm font-semibold text-primary">Legal</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-text">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted">Last updated: 22 August 2026</p>
          </div>
        </section>

        <article className="rounded-3xl border border-border bg-card px-5 py-6 shadow-sm">
          <p className="text-base leading-7 text-text">
            This policy explains how Sunnah-Ilm (“we”, “the app”) collects, uses,
            and stores information when you use the mobile application. We built
            the app to help you search and save authentic Ahadees. We do not
            sell your personal data and we do not show ads.
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-primary">{section.title}</h2>
                <div className="space-y-3 text-base leading-7 text-text [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
