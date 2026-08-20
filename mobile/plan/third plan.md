# Sunnah-Ilm — Third plan

Corpus sources and import links. First plan: `Mobile.plan.md`. Second plan: `second plan.md` (what to build). This file is **where the Hadith data comes from**.

V1 rule: import into Neon once. Do not call these APIs from the mobile app at runtime.

---

## V1 source (use this)

**fawazahmed0/hadith-api** — Arabic, English, Urdu, no API key.

- Repo: https://github.com/fawazahmed0/hadith-api
- Browser UI: https://github.com/fawazahmed0/hadiths
- Live viewer: https://fawazahmed0.github.io/hadiths
- Editions index: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json
- Grades / book info: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json

### Bukhari (full book JSON)

- English: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.json
- Arabic: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json
- Urdu: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-bukhari.json

Single hadith example (number 1):

- English: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/1.json
- Arabic: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari/1.json
- Urdu: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-bukhari/1.json

### Muslim (full book JSON)

- English: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-muslim.json
- Arabic: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.json
- Urdu: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-muslim.json

Join the three language files on `hadithnumber`. Skip a row if Arabic or English is missing.

---

## Citation / display (sunnah.com)

Store `Sahih al-Bukhari {number}` and a URL when the number matches.

- Site: https://sunnah.com
- Developers: https://sunnah.com/developers
- Official API repo: https://github.com/sunnah-com/api
- API docs: https://sunnah.stoplight.io/docs/api/

Direct hadith links (same numbering as fawazahmed0 for Bukhari/Muslim, verify by hand):

- https://sunnah.com/bukhari:1
- https://sunnah.com/muslim:1
- Anger example from the product plan: https://sunnah.com/bukhari:6116

Request an API key via a GitHub issue on sunnah-com/api if we need their official dump later. Do not scrape the website.

---

## Import into our table

| Column | From |
| --- | --- |
| collection | `bukhari` / `muslim` |
| collectionName | `Sahih al-Bukhari` / `Sahih Muslim` |
| number | `hadithnumber` |
| arabic | `ara-*.json` → `text` |
| english | `eng-*.json` → `text` |
| urdu | `urd-*.json` → `text` |
| grade | `grades[]` or `Sahih` for Bukhari/Muslim when empty |
| sourceUrl | `https://sunnah.com/{collection}:{number}` |
| source | `fawazahmed0/hadith-api@1` |
| topics | Our tags only (Namaz, Anger, Parents, …) — not in the CDN |

---

## Other sources (not V1 runtime)

Use later if we need a fuller dump or sunnah.com numbering without a key.

| Source | Link | Notes |
| --- | --- | --- |
| AhmedBaset hadith-json | https://github.com/AhmedBaset/hadith-json | ~50k rows from sunnah.com; Arabic + English; no Urdu |
| Pinned example chapter | https://github.com/AhmedBaset/hadith-json/blob/v1.2.0/db/by_chapter/the_9_books/bukhari/1.json | Pin a tag, do not use `main` |
| Hugging Face quranlab/hadith | https://huggingface.co/datasets/quranlab/hadith | `hadith_key` like `bukhari:6116`, grades, sunnah URL |
| Ikhan Bukhari English | https://github.com/Ikhan/sahih-bukhari-english | Bukhari only, JSON |
| SENODROOM Bukhari | https://github.com/SENODROOM/sahih-al-bukhari | Bukhari npm/PyPI package |
| Kutub Sittah JSONL | https://github.com/hassanmsthf11/kutub-sittah-jsonl | Shamela pages, not clean Hadith rows |

---

## Live APIs (do not use as source of truth)

Fine to read about; do not depend on them in the app.

- UmmahAPI: https://ummahapi.com/hadith-api
- islamic.app Hadith API: https://docs.islamic.app/api-reference/hadith-hadiths
- hadislam.org / Suleeyman REST API: https://github.com/Suleeyman/hadith-rest-api — https://hadislam.org/

---

## Tagging (our 10 topics)

CDN has no topic chips. After import, search English text, confirm on sunnah.com, then set `topics`.

Preference topics: Namaz, Quran, Parents, Marriage, Prayer, Love, Health, Anger, Death, Education.

Example to confirm first: Anger → Bukhari 6116 → https://sunnah.com/bukhari:6116
