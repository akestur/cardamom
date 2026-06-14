// Injected into the active tab. Returns a normalized recipe object or null.
// Reads schema.org Recipe structured data (JSON-LD), the format Google uses
// for recipe rich results, which the vast majority of recipe sites embed.
(() => {
  // --- helpers ---------------------------------------------------------------
  const clean = (s) => {
    if (s == null) return "";
    return String(s)
      .replace(/<[^>]*>/g, " ")   // strip any stray HTML tags
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&rsquo;|&apos;/g, "'")
      .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const firstString = (v) => {
    if (!v) return "";
    if (typeof v === "string") return clean(v);
    if (Array.isArray(v)) return firstString(v[0]);
    if (typeof v === "object") return clean(v.name || v.text || v.url || "");
    return "";
  };

  const asImage = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return asImage(v[0]);
    if (typeof v === "object") return v.url || v.contentUrl || "";
    return "";
  };

  const ingredients = (r) => {
    const raw = r.recipeIngredient || r.ingredients || [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map(clean).filter(Boolean);
  };

  // Instructions can be a string, an array of strings, HowToStep objects,
  // or HowToSection objects containing nested steps.
  const instructions = (r) => {
    const out = [];
    const walk = (node) => {
      if (!node) return;
      if (typeof node === "string") {
        // A blob of text may contain multiple steps separated by newlines.
        node
          .split(/\n+/)
          .map(clean)
          .filter(Boolean)
          .forEach((s) => out.push(s));
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node === "object") {
        const t = node["@type"];
        if (t === "HowToSection" || node.itemListElement) {
          walk(node.itemListElement || node.steps);
        } else {
          const txt = clean(node.text || node.name || "");
          if (txt) out.push(txt);
        }
      }
    };
    walk(r.recipeInstructions);
    return out;
  };

  const author = (r) => {
    const a = r.author;
    if (!a) return "";
    if (typeof a === "string") return clean(a);
    if (Array.isArray(a)) return a.map((x) => firstString(x)).filter(Boolean).join(", ");
    return firstString(a);
  };

  // --- gather every JSON-LD blob and flatten graphs --------------------------
  const collectNodes = () => {
    const nodes = [];
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach((s) => {
      let data;
      try {
        data = JSON.parse(s.textContent);
      } catch (e) {
        return;
      }
      const push = (d) => {
        if (!d || typeof d !== "object") return;
        if (Array.isArray(d)) return d.forEach(push);
        if (Array.isArray(d["@graph"])) d["@graph"].forEach(push);
        nodes.push(d);
      };
      push(data);
    });
    return nodes;
  };

  const isRecipe = (n) => {
    const t = n && n["@type"];
    if (!t) return false;
    return Array.isArray(t) ? t.includes("Recipe") : t === "Recipe";
  };

  const nodes = collectNodes();
  const recipe = nodes.find(isRecipe);
  if (!recipe) return null;

  const meta = (prop) => {
    const el = document.querySelector('meta[property="' + prop + '"]');
    return el ? el.getAttribute("content") : "";
  };

  return {
    title: firstString(recipe.name) || clean(document.title),
    image: asImage(recipe.image) || meta("og:image") || "",
    ingredients: ingredients(recipe),
    instructions: instructions(recipe),
    author: author(recipe),
    siteName: meta("og:site_name") || location.hostname.replace(/^www\./, ""),
    url: location.href,
  };
})();
