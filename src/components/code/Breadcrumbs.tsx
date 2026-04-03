import { VSCODE_FILE_TREE, FOLDER_NAME } from "../../config/code";
import type { TreeNode } from "../../config/code";
import type { BreadcrumbSegment } from "./types";
import { getFileIcon, FolderIcon, ChevronRight } from "./icons";

function getBreadcrumbPath(
  targetFilename: string,
  nodes: TreeNode[],
): BreadcrumbSegment[] | null {
  for (const node of nodes) {
    if (node.type === "file" && node.name === targetFilename) {
      return [{ name: node.name, type: "file" }];
    }
    if (node.type === "folder" && node.children) {
      const childPath = getBreadcrumbPath(targetFilename, node.children);
      if (childPath) {
        return [
          {
            name: node.name,
            type: "folder",
          },
          ...childPath,
        ];
      }
    }
  }
  return null;
}

export default function Breadcrumbs({
  activeFileName,
}: {
  activeFileName: string;
}) {
  const segments: BreadcrumbSegment[] = [
    {
      name: FOLDER_NAME,
      type: "folder",
    },
    ...(getBreadcrumbPath(activeFileName, VSCODE_FILE_TREE) || [
      { name: activeFileName, type: "file" } as BreadcrumbSegment,
    ]),
  ];

  return (
    <div className="h-[22px] bg-[#1e1e1e] border-t border-[#333] flex items-center px-2 gap-0.5 text-[13px] text-[#a9a9a9] shrink-0">
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer hover:bg-[#2a2d2e] hover:text-[#e0e0e0]">
            {segment.type === "folder" ? (
              <FolderIcon folderName={segment.name} isOpen={true} size={16} />
            ) : (
              getFileIcon(segment.name)
            )}
            <span>{segment.name}</span>
          </div>
          {index < segments.length - 1 && (
            <span className="text-[#555] flex mx-0.5">
              <ChevronRight size={14} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
