# Sunnah-Ilm — Hadith Search: Ask & Discover

V1 plan. One job: a question or situation in, authentic Ahadees out — with source, grade, translation, and a clearly labeled explanation. AI never invents a Hadith.

| | |
| --- | --- |
| 1 loop | Question → verified Hadith → explanation |
| 11 features | V1 scope, nothing else |
| 0 generated | Ahadees must come from the corpus |

## Hard rule

Retrieval first, generation second. The model may only explain narrations returned from the verified database. If search finds nothing, say so — do not compose a Hadith.

## Core loop

Example: “What does Islam say about controlling anger?”

1. **Question** — User types a situation or topic, or taps a topic chip (Anger, Parents, Salah).
2. **Retrieve** — Semantic search over the verified corpus. Exact wording is not required.
3. **Show Hadith** — Arabic, English, Urdu, collection, number, grade (e.g. Sahih al-Bukhari 6116).
4. **Explain** — Short AI note, labeled Explanation — not part of the Hadith. Related topics underneath.

## Screens

| Screen | What the user does | V1 |
| --- | --- | --- |
| Home | Search Ahadees, tap topics, open Ask Hadith | Yes |
| Results | Scan matches: text, source, reference, grade | Yes |
| Ask | Ask in natural language; get retrieved narrations + explanations | Yes |
| Detail | Arabic / English / Urdu, source, authenticity, explanation, related topics | Yes |
| Saved | Bookmarks of Ahadees already opened | Yes |
| Listen | Audio playback of the Hadith | After V1 |

## Home (keep it empty on purpose)

One search field. Placeholder: “What are Ahadees about parents?”

**Topic chips:** Salah · Parents · Patience · Marriage · Anger · Dua · Business · Forgiveness · Death · Jannah · Knowledge · Character

Primary action on this screen: **Ask Hadith**. That is the product, not a buried menu item.

## Hadith detail

### Content order

| Block | Rule |
| --- | --- |
| Title / topic | e.g. Helping Others |
| Arabic | The narration, not a paraphrase |
| English | Translation only |
| Urdu | Translation only |
| Source | Collection + Hadith number |
| Authenticity | Grade from the corpus (Sahih, Hasan, …) |
| Explanation | Always labeled so it cannot be mistaken for the Hadith |
| Related | Brotherhood, Charity, Kindness, … |

### Actions

- Save and Share in V1.
- Listen is the same screen later — do not block V1 on audio.
- Related Ahadees at the bottom: Patience, Forgiveness, Controlling the tongue, Good character.

## V1 vs later

### Ship (V1)

- Hadith search
- Ask Hadith
- Hadith detail
- English translation
- Urdu translation
- Arabic text
- Authenticity / grade
- Exact source + reference
- Bookmark
- Share
- Topics / categories

### Hold (not V1)

- Audio / listen
- Full-book browsing of Bukhari / Muslim as a library
- Chat-style fatwa answers
- User-generated commentary

Search quality beats feature count. If “what did the Prophet say about anger?” misses Bukhari 6116, the app failed.

## Architecture

User question → semantic search → verified Hadith rows → AI explanation of those rows only.

| Layer | Responsibility | Where it lives |
| --- | --- | --- |
| App | Search, Ask, detail, saved; never display uncited text as a Hadith | mobile: Home, Search, Ask, Hadith detail, Saved |
| API | Auth already exists. Add hadiths search, get-by-id, ask (retrieve then explain), bookmarks | server Nest + TypeORM + Neon |
| Corpus | Canonical rows: arabic, english, urdu, collection, number, grade, topics | Postgres on Neon |
| Search | Keyword plus embeddings so paraphrase still hits the right narration | Vector index over Hadith translations + topic tags |
| Ask | Embed the question, retrieve top narrations, prompt the model with those texts only | server/ai — explanation labeled, sources attached |

### Ask Hadith prompt contract

System instruction: You are explaining retrieved Ahadees. Quote only the provided Arabic/English/Urdu. Name collection and number. If none of the retrieved items answer the question, say that. Never invent a chain, grade, or wording.

## Build order

- [x] Auth (login / signup) — already in place
- [ ] Load a verified Hadith corpus (Arabic, English, Urdu, source, grade, number)
- [ ] Keyword + semantic search so queries like “anger” find “do not become angry”
- [ ] Simple home: search bar, popular topics, Ask Hadith
- [ ] Search results: Hadith text, source, reference, grade
- [ ] Detail page: Arabic, English, Urdu, source, authenticity, labeled explanation
- [ ] Ask Hadith: question → retrieve verified narrations → AI explains only those
- [ ] Bookmark and share (listen later)

Scope is V1 only. Search quality is the success metric.
