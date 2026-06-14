"use strict";

const $ = (id) => document.getElementById(id);
let currentRecipe = null;

// --- UI helpers --------------------------------------------------------------
function showStatus(msg) {
  const s = $("status");
  s.textContent = msg;
  s.hidden = false;
  $("cardWrap").hidden = true;
}

function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  // force reflow so the transition replays
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 1600);
}

function slugify(s) {
  return (s || "recipe")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "recipe";
}

// --- Render ------------------------------------------------------------------
function render(r) {
  currentRecipe = r;

  $("title").textContent = r.title || "Recipe";

  // Source line: creator and/or site, linked to the original page.
  const sourceEl = $("source");
  const who = r.author || r.siteName || "";
  sourceEl.innerHTML = "";
  if (who) sourceEl.append(document.createTextNode(who + "  ·  "));
  const link = document.createElement("a");
  link.href = r.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View original";
  sourceEl.append(link);

  // Photo (optional)
  const fig = $("figure");
  if (r.image) {
    const img = $("photo");
    img.src = r.image;
    img.alt = r.title || "";
    img.crossOrigin = "anonymous"; // best-effort for image export
    img.onerror = () => { fig.hidden = true; };
    fig.hidden = false;
  } else {
    fig.hidden = true;
  }

  const ing = $("ingredients");
  ing.innerHTML = "";
  r.ingredients.forEach((i) => {
    const li = document.createElement("li");
    li.textContent = i;
    ing.appendChild(li);
  });

  const ins = $("instructions");
  ins.innerHTML = "";
  r.instructions.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    ins.appendChild(li);
  });

  $("status").hidden = true;
  $("cardWrap").hidden = false;
  $("copyBtn").disabled = false;
  $("imgBtn").disabled = false;
}

// --- Actions -----------------------------------------------------------------
function recipeToText(r) {
  const lines = [];
  lines.push(r.title || "Recipe");
  const who = r.author || r.siteName;
  if (who) lines.push(who);
  lines.push(r.url);
  lines.push("");
  lines.push("INGREDIENTS");
  r.ingredients.forEach((i) => lines.push("- " + i));
  lines.push("");
  lines.push("INSTRUCTIONS");
  r.instructions.forEach((s, idx) => lines.push((idx + 1) + ". " + s));
  return lines.join("\n");
}

async function copyRecipe() {
  if (!currentRecipe) return;
  try {
    await navigator.clipboard.writeText(recipeToText(currentRecipe));
    toast("Copied to clipboard");
  } catch (e) {
    toast("Couldn't copy");
  }
}

async function downloadImage() {
  if (!currentRecipe) return;
  toast("Rendering image…");
  const card = $("card");
  try {
    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = slugify(currentRecipe.title) + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Image saved");
  } catch (e) {
    // Most likely a tainted canvas from a cross-origin photo that blocks CORS.
    toast("Image blocked by photo source — try Copy");
  }
}

// --- Boot: pull the recipe from the active tab -------------------------------
async function init() {
  $("copyBtn").addEventListener("click", copyRecipe);
  $("imgBtn").addEventListener("click", downloadImage);

  let tab;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch (e) {
    showStatus("Couldn't access this tab.");
    return;
  }

  if (!tab || !/^https?:/.test(tab.url || "")) {
    showStatus("Open a recipe page, then click the icon.");
    return;
  }

  let results;
  try {
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["extract.js"],
    });
  } catch (e) {
    showStatus("Can't read this page. Some sites (browser pages, PDFs) are off-limits.");
    return;
  }

  const recipe = results && results[0] && results[0].result;
  if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
    showStatus("No recipe found on this page. This works on pages with a recipe (most recipe blogs and sites).");
    return;
  }
  render(recipe);
}

document.addEventListener("DOMContentLoaded", init);
