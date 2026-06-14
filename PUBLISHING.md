# Publishing checklist

Two tracks: put the code on GitHub, and submit to the Chrome Web Store. The steps below are the ones only you can do (they need your accounts).

## 1. GitHub

The repo is already initialized and committed locally. To publish it:

1. Create a new **empty** repo on GitHub (no README/license — this folder already has them). Name suggestion: `recipe-card`.
2. In a terminal, from this folder, run:

   ```bash
   git remote add origin https://github.com/<your-username>/recipe-card.git
   git branch -M main
   git push -u origin main
   ```

3. Make the repo **public** if you want to use its `PRIVACY.md` as your privacy-policy URL for the store.

> Tip: if you have the GitHub CLI installed, you can do it in one step from this folder:
> `gh repo create recipe-card --public --source=. --push`

## 2. Chrome Web Store

1. **Register as a developer** (one-time): go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and pay the **one-time $5 USD** registration fee.
2. **Upload the package:** click *Add new item* and upload `recipe-card.zip` (already built in this folder).
3. **Fill the listing** using the copy in `STORE_LISTING.md`.
4. **Add a screenshot** (required): open a recipe page, click the extension, and screenshot the popup. Upload at 1280×800 or 640×400.
5. **Privacy:** paste your hosted `PRIVACY.md` URL, and complete the data-use form — declare **no data collection** and that you don't sell data (see justifications in `STORE_LISTING.md`).
6. **Single purpose:** describe it as "Generates a clean recipe card from the current recipe page."
7. **Submit for review.** First reviews typically take a few business days.

## Before you submit — quick sanity check

- [ ] Load unpacked once more and confirm the card renders, Copy works, and Save image works.
- [ ] Bump `version` in `manifest.json` for any future updates (the store rejects re-uploads with the same version).
- [ ] Confirm `recipe-card.zip` opens to the files at its root (manifest.json at top level, not inside a subfolder).
