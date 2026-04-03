import {
  GitBranch,
  RefreshCw,
  CircleX,
  TriangleAlert,
  Bell,
} from "lucide-react";
import { VscRemote } from "./icons";

function StatusBarItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center cursor-pointer px-1.5 h-full hover:bg-white/[.12] ${className}`}
    >
      {children}
    </div>
  );
}

export default function StatusBar({
  activeFileName,
}: {
  activeFileName: string;
}) {
  const language = activeFileName.endsWith(".md")
    ? "Markdown"
    : activeFileName.endsWith(".js") || activeFileName.endsWith(".jsx")
      ? "JavaScript"
      : "TypeScript";

  return (
    <div className="h-[22px] bg-[#007acc] flex items-center justify-between pr-2 text-xs text-white shrink-0 font-[Segoe_UI,Ubuntu,sans-serif] select-none overflow-hidden">
      <div className="flex items-center h-full">
        {/* Remote */}
        <div className="flex items-center justify-center h-full px-3 bg-[#2ea043] cursor-pointer mr-1.5 hover:bg-[#3fb950]">
          <VscRemote size={14} />
        </div>

        {/* Branch */}
        <StatusBarItem className="gap-1">
          <GitBranch size={14} />
          master*
        </StatusBarItem>

        {/* Sync */}
        <StatusBarItem>
          <RefreshCw size={14} />
        </StatusBarItem>

        {/* Errors/Warnings */}
        <StatusBarItem className="gap-1">
          <div className="flex items-center gap-0.5">
            <CircleX size={14} />
            0
          </div>
          <div className="flex items-center gap-0.5 ml-0.5">
            <TriangleAlert size={14} />
            0
          </div>
        </StatusBarItem>
      </div>

      <div className="flex items-center h-full">
        <StatusBarItem>
          <span className="hidden sm:inline">Ln 34, Col 13</span>
        </StatusBarItem>
        <StatusBarItem className="hidden md:flex">Spaces: 2</StatusBarItem>
        <StatusBarItem className="hidden md:flex">UTF-8</StatusBarItem>
        <StatusBarItem className="hidden lg:flex">LF</StatusBarItem>
        <StatusBarItem>{language}</StatusBarItem>
        <StatusBarItem>
          <Bell size={14} />
        </StatusBarItem>
      </div>
    </div>
  );
}
