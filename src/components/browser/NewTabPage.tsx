import { Globe, Search } from "lucide-react";
import { type FormEvent, memo, useCallback, useState } from "react";
import type { ShortcutTile } from "./types";

// ─── Data ──────────────────────────────────────────────────────────────────────

const SHORTCUTS: ShortcutTile[] = [
  {
    label: "GitHub",
    url: "https://github.com/zaCKoZAck0",
    color: "#6e40c9",
    letter: "G",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/ayush-kumar-yadav",
    color: "#0077b5",
    letter: "L",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Open a URL in a new browser tab, safely handling popup blockers. */
function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Normalize raw user input into a navigable URL.
 *
 * - Already has a protocol   → pass through
 * - Looks like a domain      → prepend https://
 * - Everything else           → DuckDuckGo search
 */
function normalizeInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const looksLikeDomain =
    trimmed.includes(".") &&
    !trimmed.includes(" ") &&
    /^[a-zA-Z0-9]/.test(trimmed);

  if (looksLikeDomain) return `https://${trimmed}`;

  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

// ─── Atomic: Tile ──────────────────────────────────────────────────────────────

interface TileProps {
  tile: ShortcutTile;
}

const Tile = memo(function Tile({ tile }: TileProps) {
  const handleClick = useCallback(
    () => openInNewTab(tile.url),
    [tile.url],
  );

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[#42414d] transition-colors group"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md"
        style={{ backgroundColor: tile.color }}
      >
        {tile.letter}
      </div>
      <span className="text-[11px] text-[#fbfbfe]/60 group-hover:text-[#fbfbfe]/80 truncate w-full text-center">
        {tile.label}
      </span>
    </button>
  );
});

// ─── NewTabPage ────────────────────────────────────────────────────────────────

function NewTabPage() {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const url = normalizeInput(query);
      if (!url) return;
      openInNewTab(url);
      setQuery("");
    },
    [query],
  );

  return (
    <div className="flex-1 flex flex-col items-center bg-[#2b2a33] pt-[12%] px-4 overflow-auto">
      {/* Browser logo */}
      <Globe size={80} strokeWidth={1} className="mb-8 text-[#fbfbfe]/30 drop-shadow-lg" />

      {/* Search bar */}
      <form onSubmit={handleSearch} className="w-full max-w-[580px] mb-10">
        <div className="flex items-center gap-3 bg-[#42414d] rounded-xl px-4 py-3 ring-1 ring-[#fbfbfe]/10 focus-within:ring-2 focus-within:ring-[#0060df] transition-all">
          <Search className="w-5 h-5 text-[#fbfbfe]/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web or enter address"
            className="flex-1 bg-transparent text-[15px] text-[#fbfbfe] placeholder-[#fbfbfe]/40 outline-none"
            spellCheck={false}
            autoFocus
          />
        </div>
      </form>

      {/* Shortcut tiles grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[240px]">
        {SHORTCUTS.map((tile) => (
          <Tile key={tile.url} tile={tile} />
        ))}
      </div>
    </div>
  );
}

export default memo(NewTabPage);
