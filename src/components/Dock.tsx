import { motion } from "framer-motion";
import { CodeXml, Globe, Terminal, FolderOpen, LayoutGrid } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { useWindowsStore } from "../store/windows";

interface DockApp {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
}

const apps: DockApp[] = [
  { id: "files", name: "Files", icon: FolderOpen },
  { id: "terminal", name: "Terminal", icon: Terminal },
  { id: "browser", name: "Browser", icon: Globe },
  { id: "code", name: "Code", icon: CodeXml },
];

export default function Dock() {
  const windows = useWindowsStore((s) => s.windows);
  const openWindow = useWindowsStore((s) => s.openWindow);

  return (
    <div className="order-last lg:order-none w-full h-16 lg:w-[72px] lg:h-full bg-[#1d1d1d]/80 backdrop-blur-sm flex flex-row lg:flex-col items-center justify-center lg:justify-start px-3 lg:px-0 py-0 lg:py-3 gap-2 z-40 border-t lg:border-t-0 lg:border-r border-white/5">
      {apps.map((app) => {
        const isOpen = windows[app.id]?.isOpen;
        const AppIcon = app.icon;
        return (
          <div
            key={app.id}
            className="relative group"
            onClick={() => openWindow(app.id)}
          >
            <motion.div
              className="w-12 h-12 flex items-center justify-center cursor-pointer relative text-white/50 hover:text-white"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <AppIcon size={28} strokeWidth={3} />
            </motion.div>

            {/* Open indicator dot */}
            {isOpen && (
              <div className="absolute lg:top-1/2 lg:-translate-y-1/2 lg:-left-1.5 -bottom-1 lg:bottom-auto left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 size-1 bg-orange-500 rounded-full" />
            )}

            {/* Tooltip - only on desktop */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#1d1d1d] text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg hidden lg:block">
              {app.name}
            </div>
          </div>
        );
      })}

      {/* Separator + Show Apps - desktop only */}
      <div className="hidden lg:block mt-auto">
        <div className="w-full h-px bg-white/20 mb-3" />
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <LayoutGrid size={24} strokeWidth={1.5} />
        </motion.div>
      </div>
    </div>
  );
}
