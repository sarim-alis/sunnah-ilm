# Sunnah-Ilm — Second plan

Continuation after auth, profile, and preferences. Same product: a question or situation in, authentic Ahadees out. AI never invents a Hadith.

First plan: `Mobile.plan.md`. This file is what we build next.

## Done

- Auth (login / signup / JWT)
- Profile (photo, name, email, password)
- Preferences table (user 1 → many, max 3 topics)
- Dark / light mode
- Home shell, Search / Ask / Saved / Detail screens exist as stubs

## Hard rule (unchanged)

Retrieval first, generation second. The model may only explain narrations returned from the verified database. If search finds nothing, say so — do not compose a Hadith.

## Build order

Do these in order. Search, Ask, Detail, and Saved all depend on the corpus.

### 1. Hadith corpus (server)

Create a `hadiths` table and seed a small verified set.

| Column | Notes |
| --- | --- |
| id | uuid |
| collection | e.g. Sahih al-Bukhari |
| number | Hadith number in that collection |
| arabic | Narration, not a paraphrase |
| english | Translation only |
| urdu | Translation only |
| narrator | Chain / narrator label from the source |
| grade | Sahih, Hasan, … from the corpus |
| topics | Tags aligned with app topics (Prayer, Anger, Parents, …) |

Seed enough rows to hit the preference topics (Quran, Parents, Marriage, Prayer, Love, Health, Anger, Death, Education). Quality over volume. Every row must be a real, citable narration.

### 2. Search API

- `GET /api/hadiths/search?q=` — keyword + topic match
- `GET /api/hadiths/:id` — full row for detail
- Start with keyword / topic search. Add embeddings only after “anger” reliably finds “do not become angry”

Success metric: paraphrased questions still return the right verified row. If they miss, the app failed.

### 3. Home

Keep it simple.

- One search field. Placeholder: “What are Ahadees about parents?”
- Topic chips: user preferences first, then popular topics
- Primary action: **Ask Hadith**
- Chip or search submit opens results — not a library browser

Hold: full-book browsing of Bukhari / Muslim.

### 4. Search results

Scan matches on one card:

- English (or Arabic snippet)
- Collection + number
- Grade

Tap opens detail. Empty state if nothing matched — never invent a Hadith.

### 5. Hadith detail

Content order:

1. Title / topic
2. Arabic
3. English
4. Urdu
5. Source (collection + number)
6. Authenticity (grade from the corpus)
7. Explanation — labeled, not part of the Hadith (fill in at step 6)
8. Related topics

Actions in V1: Save, Share. Listen after V1.

### 6. Ask Hadith

Question → retrieve verified rows → model explains **only those rows**.

Prompt contract:

- Quote only the provided Arabic / English / Urdu
- Name collection and number
- If none of the retrieved items answer the question, say that
- Never invent a chain, grade, or wording

Explanation on the result must be labeled so it cannot be mistaken for the Hadith.

### 7. Bookmark and share

- Bookmark from detail; list on Saved
- Share the citation (collection, number, translation)
- Bookmarks are Ahadees the user already opened

## Hold (not this plan)

- Audio / listen
- Full-book library of Bukhari / Muslim
- Chat-style fatwa answers
- User-generated commentary

## Current stubs to replace

| File | Today |
| --- | --- |
| `server` | No hadiths module |
| `mobile/src/services/hadith.ts` | Returns `[]` / `null` |
| `mobile/src/services/ai.ts` | Returns `''` |
| Search / Ask / Saved / Detail screens | Title only |

## Start here

**Step 1 — `hadiths` table + seed.** Do not build Ask or pretty results until search can return a real Bukhari / Muslim row for a topic the user already saved.
