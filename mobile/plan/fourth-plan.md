# Sunnah-Ilm — Fourth plan

Web admin in `sunnah/` (Next.js). Corpus is entered by hand through the admin panel — same Neon table, same Nest API. No CDN import. No public search/ask on the website.

First plan: `Mobile.plan.md`. Second: `second plan.md`. Third: `third plan.md` (source reference only). This file is the **desktop admin**.

---

## Already done (do not rebuild)

- Nest API: `POST /api/users/login`, JWT, `AdminGuard`
- `hadith` table + admin CRUD:
  - `POST /api/hadith`
  - `GET /api/hadith?q=&topic=`
  - `PATCH /api/hadith/:id`
  - `DELETE /api/hadith/:id`
- Mobile admin: login, list, add, edit, view, delete
- `sunnah/` already has `/privacy` and `/delete-account` for the Play Store. Leave them.

Admins type verified Bukhari / Muslim rows in the panel. Phone and website write to the same database.

---

## What we build

A **login-only** website for admins. After login, the same Hadith screens as the mobile admin — list, add, edit, view, delete. No signup. No user home. No Ask.

If the account is not `role: admin`, reject and stay on login.

---

## Screens (match mobile)

| Route | Mobile source | What it does |
| --- | --- | --- |
| `/login` | `LoginScreen` | Email, password, logo, “Welcome Back” / “Sign in to continue”. No Sign Up link. |
| `/hadiths` | `AdminHadithsScreen` | List, search, topic filter, pager, view / edit / delete |
| `/hadiths/new` | `AddHadithScreen` | Three steps: Source → Narration → Translation |
| `/hadiths/:id/edit` | `AddHadithScreen` (edit) | Same form, prefilled, `PATCH` |

Use the existing palette in `sunnah/src/theme/colors.ts` (same greens / cream as the app).

### Login (do this first)

Copy the mobile login, not a new design:

- Sunnah-Ilm logo
- Welcome Back
- Sign in to continue
- Email + password (show/hide)
- Sign In button
- Errors under the form (wrong password, not admin, network)

Call `POST /api/users/login`. Store the JWT. If `user.role !== 'admin'`, do not enter the panel.

No register. No “Don’t have an account?”.

### Hadith list

Same behavior as `AdminHadithsScreen`:

- Search
- Filter by the 9 topics
- Cards: book, number, topic, narrator
- View, edit, delete
- Confirm before delete

### Add / edit

Same wizard as `AddHadithScreen`:

1. **Source** — book chip (Sahih al-Bukhari / Sahih Muslim), hadith number, Arabic number, chapter, reference
2. **Narration** — narrator, topic chips, grade (Sahih / Hasan), text
3. **Translation** — English (required), Urdu, Arabic, description (labeled, not part of the Hadith)

Confirm modal, then `POST` or `PATCH`. Same payload as mobile `CreateHadithInput`.

---

## Auth / routing

- Public: `/login`, `/privacy`, `/delete-account`
- Protected: `/hadiths`, `/hadiths/new`, `/hadiths/:id/edit`
- No token → `/login`
- Token but not admin → `/login` with an error
- Logged-in admin hitting `/` → `/hadiths` (keep `/privacy` as its own URL)

CORS on the Nest server is already open. Point the Next app at the same API base URL the mobile app uses (`/api`).

---

## Build order

Do these in order.

1. **Login page** — look like mobile login, JWT, admin-only gate
2. **Session** — persist token, attach `Authorization` on hadith requests, logout
3. **List** — `GET /api/hadith`, search, topic filter, delete
4. **Add** — three-step form, `POST /api/hadith`
5. **Edit** — same form, `PATCH /api/hadith/:id`
6. **View** — Arabic / English / Urdu / source / grade (read-only)

---

## Hold (not this plan)

- Signup / public accounts on the web
- Home, Search, Ask, Saved for regular users
- CDN / bulk import (third plan is a source list, not a pipeline)
- Changing the Nest hadith schema
- Audio

---

## Start here

**Step 1 — `/login` in `sunnah/`.** Same page as the app. Admin JWT only. Do not build the Hadith form until login keeps a non-admin out.
