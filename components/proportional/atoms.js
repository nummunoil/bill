import { AVATAR_PALETTE } from "../../lib/bill-calc";

export function Avatar({ person, idx = 0, size = 32, dim = false }) {
  const [bg, text] = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  const initial = (person?.name || "?").slice(0, 1) || "?";
  return (
    <span
      title={person?.name}
      className={`inline-flex items-center justify-center rounded-full font-semibold ${
        dim ? "bg-gray-100 text-gray-400" : `${bg} ${text}`
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {initial}
    </span>
  );
}

// Pill button with avatar + label + optional right label.
// muted=true → "ทั้งบิล" style (dark bg when active, no person color).
export function PersonTab({
  label,
  active,
  onClick,
  person,
  idx = 0,
  rightLabel,
  muted = false,
}) {
  const [bg, text] = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];

  const tabBg = active
    ? muted
      ? "bg-gray-900 text-white border-gray-900"
      : `${bg} ${text} border-current`
    : "bg-white text-gray-700 border-gray-200";

  const dotBg = active
    ? muted
      ? "bg-white text-gray-900"
      : "bg-white/70"
    : "bg-gray-100 text-gray-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 text-xs font-medium transition ${tabBg}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${dotBg}`}
      >
        {muted ? "∀" : (person?.name || "?").slice(0, 1) || "?"}
      </span>
      <span>{label}</span>
      {rightLabel != null && (
        <span
          className={`ml-1 text-xs font-semibold ${
            active ? "opacity-100" : "opacity-60"
          }`}
        >
          {rightLabel}
        </span>
      )}
    </button>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <div
      className={`text-[10px] font-semibold uppercase tracking-wider text-gray-500 ${className}`}
    >
      {children}
    </div>
  );
}
