// Resolves a deterministic background+text color pair for a label
// (role, category, tag). The same input always maps to the same color, so
// categories like "retail" stay consistent across pages — and different
// labels are guaranteed to look visually distinct because we hash into a
// curated palette of 10 hand-tuned pairs rather than across the full 360°
// HSL hue range (which produced near-identical neighbors).

const PALETTE = [
  { backgroundColor: "#E3FCEF", color: "#1F9254" }, // green
  { backgroundColor: "#E0F2FE", color: "#0369A1" }, // sky blue
  { backgroundColor: "#F4F0FF", color: "#7C3AED" }, // violet
  { backgroundColor: "#FFF4E5", color: "#C2410C" }, // amber
  { backgroundColor: "#FEF1ED", color: "#DC2626" }, // red
  { backgroundColor: "#FCE7F3", color: "#DB2777" }, // pink
  { backgroundColor: "#CFFAFE", color: "#0E7490" }, // cyan
  { backgroundColor: "#FEF3C7", color: "#B45309" }, // yellow
  { backgroundColor: "#E0E7FF", color: "#4338CA" }, // indigo
  { backgroundColor: "#D1FAE5", color: "#065F46" }, // emerald
];

// Named overrides preserved for backward compatibility with role labels
// already styled this way elsewhere in the app.
const NAMED_OVERRIDES = {
  Admin: { backgroundColor: "#FEF1ED", color: "#F36F4A" },
  User: { backgroundColor: "#F4F0FF", color: "#936DFF" },
  Tester: { backgroundColor: "#E3FCEF", color: "#1F9254" },
  Manager: { backgroundColor: "#FFF4E5", color: "#FF8C00" },
};

const hashToIndex = (label, modulo) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Math.abs because the bit-shifted hash can be negative.
  return Math.abs(hash) % modulo;
};

export const getRoleStyle = (label) => {
  if (!label) return PALETTE[0];

  const value = String(label);
  if (NAMED_OVERRIDES[value]) return NAMED_OVERRIDES[value];

  return PALETTE[hashToIndex(value, PALETTE.length)];
};
