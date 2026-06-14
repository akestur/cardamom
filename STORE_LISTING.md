# Chrome Web Store — Listing Copy

Copy/paste these into the Web Store Developer Dashboard when you create the listing.

---

## Name (max 75 chars)
Recipe Card — Clean Recipe Cards

## Summary (max 132 chars)
Turn any recipe page into a clean, minimal card. One click for the title, photo, ingredients, and steps — copy it or save as an image.

## Category
Productivity

## Language
English

---

## Description (detailed)

Recipe sites are buried under life stories, ads, and pop-ups. Recipe Card cuts through all of it.

Click the icon on any recipe page and Recipe Card instantly builds a clean, minimal card with everything you actually need:

• Dish title
• Photo
• Ingredients
• Step-by-step instructions
• A link back to the original recipe

Then do what you want with it:

• Copy — grab the whole recipe as clean, plain text for your notes, a message, or a doc.
• Save image — download the card as a crisp PNG to keep or share.

How it works: Recipe Card reads the recipe data that sites already publish for search engines (schema.org structured data), so the result is clean and accurate — not a messy scrape. If a page has no recipe, it simply tells you.

Privacy first: everything happens in your browser. Recipe Card reads a page only when you click the icon, sends nothing to any server, and has no tracking, ads, or accounts.

---

## Permission justifications (you'll be asked for these)

**activeTab** — Used to read the current page's recipe content only when the user clicks the extension icon. Nothing is accessed in the background.

**scripting** — Used to run a small script on the active tab (on click) that reads the page's schema.org recipe data to build the card.

**Host permissions** — None requested. The extension works through activeTab on click, so no broad site access is needed.

**Remote code** — None. All code, including the html2canvas library, is bundled in the package. No remote scripts are loaded.

**Data usage disclosures** — The extension does NOT collect or transmit any user data. On the privacy form, check that you do not sell data and that data is not used for anything outside the single approved purpose (the app's core function).

---

## Assets you need to upload (sizes)

- Store icon: 128×128 PNG — already in `icons/icon128.png`.
- At least one screenshot: 1280×800 or 640×400 PNG/JPG. (Take a screenshot of the popup card on a real recipe page.)
- Optional small promo tile: 440×280 PNG.

## Privacy policy URL

The store requires a publicly hosted privacy policy URL. The easiest option: push this repo to GitHub (public) and use the raw/rendered link to PRIVACY.md, e.g.
https://github.com/<your-username>/recipe-card/blob/main/PRIVACY.md
