import { CodeXml } from "lucide-react";

const SHORTCUTS = [
  { label: "Open Chat", keys: ["^", "\u2318", "I"] },
  { label: "Show All Commands", keys: ["\u21E7", "\u2318", "P"] },
  { label: "Start Debugging", keys: ["F5"] },
];

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] gap-6 select-none">
      <CodeXml size={200} strokeWidth={0.5} className="opacity-15 text-[#ccc]" />
      <div className="flex flex-col gap-3 text-sm text-[#969696]">
        {SHORTCUTS.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-12"
          >
            <span>{item.label}</span>
            <div className="flex gap-1">
              {item.keys.map((k) => (
                <kbd
                  key={k}
                  className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[#2d2d2d] border border-[#444] rounded text-xs text-[#ccc] font-[inherit]"
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
