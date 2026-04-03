import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Globe,
} from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  memo,
  useCallback,
  useState,
} from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

/** Open a URL in a new browser tab, safely handling popup blockers. */
function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Atomic: NavButton ─────────────────────────────────────────────────────────

interface NavButtonProps {
  disabled?: boolean;
  title: string;
  children: ReactNode;
}

const NavButton = memo(function NavButton({
  disabled = true,
  title,
  children,
}: NavButtonProps) {
  return (
    <div
      title={title}
      className={`w-7 h-7 rounded flex items-center justify-center ${
        disabled
          ? "text-[#fbfbfe]/20 cursor-default"
          : "text-[#fbfbfe]/70"
      }`}
    >
      {children}
    </div>
  );
});

// ─── NavigationBar ─────────────────────────────────────────────────────────────

function NavigationBar() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const url = normalizeInput(inputValue);
      if (!url) return;
      openInNewTab(url);
      setInputValue("");
      (document.activeElement as HTMLElement)?.blur();
    },
    [inputValue],
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }, []);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      e.target.select();
    },
    [],
  );

  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-[#2b2a33]">
      {/* Decorative navigation buttons */}
      <NavButton title="Back (Alt+Left)">
        <ArrowLeft className="w-4 h-4" />
      </NavButton>
      <NavButton title="Forward (Alt+Right)">
        <ArrowRight className="w-4 h-4" />
      </NavButton>
      <NavButton title="Reload (Ctrl+R)">
        <RotateCw className="w-3.5 h-3.5" />
      </NavButton>
      <NavButton title="Home">
        <Home className="w-4 h-4" />
      </NavButton>

      {/* Address bar — opens URLs in a new browser tab */}
      <form onSubmit={handleSubmit} className="flex-1 mx-1">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-[#42414d] transition-all ${
            isFocused
              ? "ring-2 ring-[#0060df] bg-[#42414d]"
              : "hover:bg-[#52525e]"
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#fbfbfe]/50 shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter address"
            className="flex-1 bg-transparent text-[13px] text-[#fbfbfe] placeholder-[#fbfbfe]/40 outline-none"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}

export default memo(NavigationBar);
