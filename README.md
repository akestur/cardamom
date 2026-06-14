# Cardamom — Just the Recipe

A Chrome extension that turns any recipe page into a clean, minimal recipe card. Click the icon while on a recipe page and Cardamom pulls the dish title, photo, ingredients, instructions, and source into a single uncluttered card you can **copy** or **save as an image**.

## How it works

Almost every recipe site embeds [schema.org Recipe](https://schema.org/Recipe) structured data (JSON-LD) — the same data Google reads for recipe rich results. The extension reads that block directly instead of scraping messy HTML, so the output is clean and reliable. If a page has no recipe data, it says so rather than guessing.

## Install (developer mode)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this project folder.
4. Pin the extension, open any recipe page, and click the icon.

## Use

- **Copy** — copies the recipe as clean plain text (title, source, ingredients, numbered steps).
- **Save image** — downloads the card as a PNG.

> Note on Save image: some sites serve photos that block cross-origin export. If the image can't be captured you'll see a notice — Copy still works, and the card itself still displays the photo.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Manifest V3 config |
| `popup.html` / `popup.css` | The card UI |
| `popup.js` | Loads the recipe, renders the card, handles Copy / Save image |
| `extract.js` | Injected into the page; parses schema.org Recipe JSON-LD |
| `html2canvas.min.js` | Renders the card to a PNG (bundled locally for MV3) |
| `icons/` | Toolbar icons |

## Permissions

`activeTab` + `scripting` only — the extension reads the page **only** when you click the icon, and nothing leaves your browser.
