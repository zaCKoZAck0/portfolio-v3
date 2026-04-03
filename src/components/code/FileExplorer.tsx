import { useState } from "react";
import { VSCODE_FILE_TREE, WORKSPACE_NAME } from "../../config/code";
import type { TreeNode, GitStatus } from "../../config/code";
import { getFileIcon, FolderIcon, ChevronDown, ChevronRight } from "./icons";

const GIT_STATUS_STYLES: Record<
  Exclude<GitStatus, "ignored">,
  { letter: string; color: string }
> = {
  A: { letter: "A", color: "#73c991" },
  M: { letter: "M", color: "#e2c08d" },
  U: { letter: "U", color: "#73c991" },
  D: { letter: "D", color: "#c74e39" },
  C: { letter: "C", color: "#e5534b" },
};

function TreeItem({
  node,
  depth,
  activeFile,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string;
  onSelect: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(node.open ?? false);
  const isFolder = node.type === "folder";
  const isActive = !isFolder && node.name === activeFile;
  const isIgnored = node.gitStatus === "ignored";
  const statusStyle =
    node.gitStatus && node.gitStatus !== "ignored"
      ? GIT_STATUS_STYLES[node.gitStatus]
      : null;

  return (
    <>
      <div
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(node.name);
        }}
        className={`flex items-center gap-1.5 pr-2.5 h-[26px] cursor-pointer text-sm text-[#ccc] whitespace-nowrap select-none ${
          isActive ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
        }`}
        style={{
          paddingLeft: 12 + depth * 12,
          ...(isIgnored ? { opacity: 0.5 } : {}),
        }}
      >
        {isFolder ? (
          <>
            <span className="text-[#c5c5c5] flex items-center">
              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
            <FolderIcon folderName={node.name} isOpen={isOpen} />
            <span>{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-3" />
            {getFileIcon(node.name)}
            <span
              style={statusStyle ? { color: statusStyle.color } : undefined}
            >
              {node.name}
            </span>
            {statusStyle && (
              <span
                className="ml-auto text-[11px] font-semibold"
                style={{ color: statusStyle.color }}
              >
                {statusStyle.letter}
              </span>
            )}
          </>
        )}
      </div>
      {isFolder &&
        isOpen &&
        node.children?.map((child) => (
          <TreeItem
            key={child.name}
            node={child}
            depth={depth + 1}
            activeFile={activeFile}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

export default function FileExplorer({
  activeFileName,
  onSelectFile,
  width,
}: {
  activeFileName: string;
  onSelectFile: (name: string) => void;
  width: number;
}) {
  return (
    <div
      className="bg-[#252526] flex flex-col shrink-0 border-r border-[#1e1e1e]"
      style={{ width }}
    >
      <div className="h-10 flex items-center px-4 text-xs font-semibold text-[#bbb] uppercase tracking-[0.8px]">
        Explorer
      </div>

      <div className="h-7 flex items-center px-3 text-xs font-bold text-[#ccc] bg-[#2a2d2e] gap-1.5 uppercase tracking-[0.5px]">
        <ChevronDown size={10} />
        <span>{WORKSPACE_NAME}</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0.5">
        {VSCODE_FILE_TREE.map((node) => (
          <TreeItem
            key={node.name}
            node={node}
            depth={0}
            activeFile={activeFileName}
            onSelect={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}
