import {
  getFileIcon,
  VscClose,
  VscOpenPreviewSide,
  VscSplitEditorRight,
  VscEllipsis,
} from "./icons";
import { Bot } from "lucide-react";

export default function EditorTabs({
  tabs,
  activeFileId,
  activeFileName,
  isMarkdown,
  showPreview,
  onSelectTab,
  onCloseTab,
  onTogglePreview,
}: {
  tabs: { id: string; name: string }[];
  activeFileId: string;
  activeFileName: string;
  isMarkdown: boolean;
  showPreview: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onTogglePreview: () => void;
}) {
  const hasOpenTabs = tabs.length > 0;

  return (
    <div className="flex h-8.75 bg-[#252526] shrink-0">
      {/* Scrollable tabs */}
      <div className="flex flex-1 min-w-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeFileId;
          return (
            <>
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-4 h-full text-sm cursor-pointer border-r border-[#1e1e1e] whitespace-nowrap select-none ${
                  isActive && !showPreview
                    ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
                    : "bg-[#2d2d2d] border-t-2 border-t-transparent" +
                      (isActive ? " text-white" : " text-[#969696]")
                }`}
              >
                {getFileIcon(tab.name, 16)}
                <span>{tab.name}</span>
                <span
                  className="ml-2 w-5 h-5 flex items-center justify-center rounded text-sm text-[#969696] leading-none hover:bg-[#ffffff15]"
                  onClick={(e) => onCloseTab(tab.id, e)}
                >
                  <VscClose size={14} />
                </span>
              </div>
              {isActive && showPreview && isMarkdown && (
                <div className="flex items-center gap-3 px-4 h-full text-sm cursor-pointer bg-[#1e1e1e] text-white border-r border-[#1e1e1e] border-t-2 border-t-[#007acc] whitespace-nowrap select-none italic">
                  <VscOpenPreviewSide size={16} />
                  <span className="italic">Preview {activeFileName}</span>
                  <span
                    className="ml-2 w-5 h-5 flex items-center justify-center rounded text-sm text-[#969696] leading-none hover:bg-[#ffffff15]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePreview();
                    }}
                  >
                    <VscClose size={14} />
                  </span>
                </div>
              )}
            </>
          );
        })}

        {/* Preview tab */}
      </div>

      {/* Tab action buttons (sticky right) */}
      {hasOpenTabs && (
        <div className="flex items-center gap-0.5 px-2 shrink-0 bg-[#252526]">
          {isMarkdown && (
            <>
              <div
                title="Claude"
                className="size-5.5 flex items-center justify-center rounded cursor-pointer text-[#969696] hover:bg-[#ffffff15] hover:text-[#ccc]"
              >
                <Bot size={18} className="shrink-0" />
              </div>
              <div
                title="Open Preview to the Side"
                onClick={onTogglePreview}
                className="size-5.5 flex items-center justify-center rounded cursor-pointer text-[#969696] hover:bg-[#ffffff15] hover:text-[#ccc]"
              >
                <VscOpenPreviewSide size={18} />
              </div>
            </>
          )}
          <div
            title="Split Editor Right"
            className="size-5.5 flex items-center justify-center rounded cursor-pointer text-[#969696] hover:bg-[#ffffff15] hover:text-[#ccc]"
          >
            <VscSplitEditorRight size={18} />
          </div>
          <div
            title="More Actions..."
            className="size-5.5 flex items-center justify-center rounded cursor-pointer text-[#969696] hover:bg-[#ffffff15] hover:text-[#ccc]"
          >
            <VscEllipsis size={18} />
          </div>
        </div>
      )}
    </div>
  );
}
