import { Wifi, Battery, Volume2 } from "lucide-react";

export default function TopBar() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="h-8 w-full bg-[#1d1d1d] flex items-center justify-between px-3 text-white/90 text-[13px] font-medium z-50 select-none">
      {/* Left: Activities */}
      <div className="flex items-center gap-4">
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          Activities
        </span>
      </div>

      {/* Center: Date & Time */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
        <span>{dateStr}</span>
        <span>{timeStr}</span>
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <Wifi className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
