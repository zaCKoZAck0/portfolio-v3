import {
  FileText,
  FileCode,
  FileJson,
  FileType,
  File,
  Folder,
  FolderOpen,
  FolderCode,
  FolderDot,
  FolderArchive,
  Package,
  Zap,
  ShieldCheck,
  Paintbrush,
  GitBranch,
  FileCode2,
  Triangle,
  CodeXml,
  Bot,
  Info,
  FileKey,
  Settings,
  FileCog,
  Files,
  Search,
  Puzzle,
  X,
  MonitorDot,
  PanelRight,
  Columns2,
  Ellipsis,
  ChevronRight as LucideChevronRight,
  ChevronDown as LucideChevronDown,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

// ─── Icon Registry ─────────────────────────────────────────────────────────────
// Single source of truth: maps semantic keys to Lucide components.
// Every consumer resolves icons through this registry — no SVG files needed.

type IconEntry = ComponentType<LucideProps>;

/** File-type icon registry keyed by exact filename or extension pattern. */
const FILE_ICON_REGISTRY: Record<string, IconEntry> = {
  // Exact filenames
  "README.md": Info,
  "tsconfig.json": FileCog,
  "tsconfig.app.json": FileCog,
  "tsconfig.node.json": FileCog,
  "vite.config.ts": Zap,
  "eslint.config.js": ShieldCheck,
  "package.json": Package,
  "pnpm-lock.yaml": Package,
  ".gitignore": GitBranch,
  ".prettierrc": Paintbrush,

  // Extensions
  "ext:md": FileText,
  "ext:tsx": FileCode,
  "ext:ts": FileCode,
  "ext:js": FileCode,
  "ext:jsx": FileCode,
  "ext:json": FileJson,
  "ext:css": Paintbrush,
  "ext:html": FileCode2,
  "ext:yaml": FileCog,
  "ext:yml": FileCog,
  "ext:toml": FileCog,
  "ext:pdf": FileType,
  "ext:env": FileKey,
  "ext:svg": FileCode2,

  // Fallback prefix for dotfiles
  "prefix:.": FileCog,
};

/** Folder-type icon registry keyed by folder name. */
const FOLDER_ICON_REGISTRY: Record<
  string,
  { closed: IconEntry; open: IconEntry }
> = {
  node_modules: { closed: FolderArchive, open: FolderArchive },
  src: { closed: FolderCode, open: FolderCode },
  public: { closed: FolderDot, open: FolderDot },
};

const DEFAULT_FOLDER = { closed: Folder, open: FolderOpen };

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Renders a Lucide icon for a given filename.
 * Resolution order: exact name → extension → prefix → default.
 */
export function getFileIcon(filename: string, size = 16) {
  const LucideIcon = resolveFileIcon(filename);
  return <LucideIcon size={size} className="shrink-0" />;
}

/** Returns the Lucide component for a filename (without rendering). */
export function resolveFileIcon(filename: string): IconEntry {
  // 1. Exact filename match
  if (FILE_ICON_REGISTRY[filename]) return FILE_ICON_REGISTRY[filename];

  // 2. Extension match
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext && FILE_ICON_REGISTRY[`ext:${ext}`])
    return FILE_ICON_REGISTRY[`ext:${ext}`];

  // 3. .env* prefix
  if (filename.startsWith(".env")) return FileKey;

  // 4. Generic dotfile
  if (filename.startsWith(".")) return FileCog;

  // 5. Default
  return File;
}

/**
 * Returns a pair of Lucide components { closed, open } for a folder name.
 * Uses registry or falls back to generic Folder/FolderOpen.
 */
export function getFolderIcons(folderName?: string) {
  if (folderName && FOLDER_ICON_REGISTRY[folderName])
    return FOLDER_ICON_REGISTRY[folderName];
  return DEFAULT_FOLDER;
}

/**
 * Renders a folder icon — open or closed variant.
 */
export function FolderIcon({
  folderName,
  isOpen,
  size = 16,
}: {
  folderName?: string;
  isOpen: boolean;
  size?: number;
}) {
  const icons = getFolderIcons(folderName);
  const LucideIcon = isOpen ? icons.open : icons.closed;
  return <LucideIcon size={size} className="shrink-0" />;
}

/**
 * Renders a generic file icon by name (backwards-compat shim).
 * Consumers that previously used <Icon name="claude_ai.svg" /> can migrate
 * to the specific Lucide components exported below.
 */
export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const LucideIcon = NAMED_ICON_MAP[name] ?? File;
  return <LucideIcon size={size} className="shrink-0" />;
}

/** Map from old SVG filenames to Lucide components (migration bridge). */
const NAMED_ICON_MAP: Record<string, IconEntry> = {
  "claude_ai.svg": Bot,
  "file_type_markdown.svg": FileText,
  "file_type_typescript.svg": FileCode,
  "file_type_tsconfig.svg": FileCog,
  "file_type_npm.svg": Package,
  "file_type_pnpm.svg": Package,
  "file_type_vite.svg": Zap,
  "file_type_eslint.svg": ShieldCheck,
  "file_type_prettier.svg": Paintbrush,
  "file_type_git.svg": GitBranch,
  "file_type_html.svg": FileCode2,
  "file_type_json.svg": FileJson,
  "file_type_config.svg": FileCog,
  "file_type_toml.svg": FileCog,
  "file_type_pdf2.svg": FileType,
  "file_type_dotenv.svg": FileKey,
  "file_type_info.svg": Info,
  "file_type_vercel.svg": Triangle,
  "file_type_vscode.svg": CodeXml,
  "file_type_bun.svg": Package,
  "file_type_bunfig.svg": FileCog,
  "default_file.svg": File,
  "default_folder.svg": Folder,
  "default_folder_opened.svg": FolderOpen,
  "folder_type_node.svg": FolderArchive,
  "folder_type_node_opened.svg": FolderArchive,
  "folder_type_src.svg": FolderCode,
  "folder_type_src_opened.svg": FolderCode,
  "folder_type_public.svg": FolderDot,
  "folder_type_public_opened.svg": FolderDot,
};

// ─── Code Sidebar / Chrome Icons ───────────────────────────────────────────────
// Re-export Lucide components under the old names so consumers don't break.

export const VscFiles = ({ size = 24 }: { size?: number }) => (
  <Files size={size} />
);
export const VscSearch = ({ size = 24 }: { size?: number }) => (
  <Search size={size} />
);
export const VscSourceControl = ({ size = 24 }: { size?: number }) => (
  <GitBranch size={size} />
);
export const VscExtensions = ({ size = 24 }: { size?: number }) => (
  <Puzzle size={size} />
);
export const VscSettings = ({ size = 24 }: { size?: number }) => (
  <Settings size={size} />
);
export const VscClose = ({ size = 16 }: { size?: number }) => <X size={size} />;
export const VscRemote = ({ size = 16 }: { size?: number }) => (
  <MonitorDot size={size} />
);
export const VscOpenPreviewSide = ({ size = 16 }: { size?: number }) => (
  <PanelRight size={size} />
);
export const VscSplitEditorRight = ({ size = 16 }: { size?: number }) => (
  <Columns2 size={size} />
);
export const VscEllipsis = ({ size = 16 }: { size?: number }) => (
  <Ellipsis size={size} />
);

// ─── Chevrons ──────────────────────────────────────────────────────────────────

export const ChevronRight = ({ size = 12 }: { size?: number }) => (
  <LucideChevronRight size={size} />
);
export const ChevronDown = ({ size = 12 }: { size?: number }) => (
  <LucideChevronDown size={size} />
);
