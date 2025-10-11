// Helpers for variant option chips parsing and combinations

export const parseValues = (text) =>
  (text || "")
    .split(/[\,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);

export const getCommittedValues = (text) => {
  const value = String(text || "");
  const hasTrailingDelimiter = /[\,\n]\s*$/.test(value);
  if (hasTrailingDelimiter) return parseValues(value);
  const parts = value.split(/[\,\n]/).map((p) => p.trim());
  if (parts.length <= 1) return [];
  return parts.slice(0, parts.length - 1).filter(Boolean);
};

export const getTyping = (text) => {
  const value = String(text || "");
  if (/[\,\n]\s*$/.test(value)) return "";
  const parts = value.split(/[\,\n]/);
  return parts[parts.length - 1] || "";
};

export const cartesian = (arrays) => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0].map(v => [v]);
  
  // Start with the first array, then combine with the rest
  let result = arrays[0].map(v => [v]);
  
  for (let i = 1; i < arrays.length; i++) {
    const curr = arrays[i];
    result = result
      .map(combo => curr.map(value => [...combo, value]))
      .flat();
  }
  
  return result;
};
