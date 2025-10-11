// Variant normalization and deduplication helpers

/**
 * Parse a variant display name like "color: Red / size: M" into a map.
 */
export const parseVariantAttributes = (variantName) => {
  if (!variantName) return {};
  const attributes = {};
  const parts = String(variantName).split(" / ");

  let lastValueWithoutKey = null;
  let sizeKeyFound = false;

  parts.forEach((part) => {
    const colonIndex = part.indexOf(":");
    if (colonIndex > 0) {
      const key = part.substring(0, colonIndex).trim();
      const value = part.substring(colonIndex + 1).trim();
      if (key && value) {
        attributes[key] = value;
        if (key.toLowerCase() === "size") sizeKeyFound = true;
      }
    } else {
      lastValueWithoutKey = part.trim();
    }
  });

  if (sizeKeyFound && lastValueWithoutKey) {
    attributes["size"] = lastValueWithoutKey;
  }

  return attributes;
};

/**
 * Build a stable key for a set of attributes for deduplication.
 */
export const buildAttributesKey = (attrs) => {
  const keys = Object.keys(attrs).sort((a, b) => a.localeCompare(b));
  return keys.map((k) => `${k}:${attrs[k]}`).join("|");
};

/**
 * Build a normalized display name, ordering color and size first.
 */
export const buildDisplayName = (attrs) => {
  const orderedKeys = [
    "color",
    "size",
    ...Object.keys(attrs)
      .filter((k) => k !== "color" && k !== "size")
      .sort(),
  ];
  const parts = orderedKeys
    .filter((k) => attrs[k])
    .map((k) => `${k}: ${attrs[k]}`);
  return parts.join(" / ");
};

/**
 * Remove duplicate variants by their attribute key and normalize names.
 */
export const dedupeNormalizeVariants = (inputVariants = []) => {
  const seen = new Set();
  const result = [];
  inputVariants.forEach((v) => {
    const attrs = parseVariantAttributes(v?.name);
    const key = buildAttributesKey(attrs);
    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        ...v,
        name: buildDisplayName(attrs) || v?.name,
      });
    }
  });
  return result;
};
