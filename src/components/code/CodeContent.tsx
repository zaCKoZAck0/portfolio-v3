import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { EditorView } from "@codemirror/view";
import MarkdownEditor from "../windows/MarkdownEditor";
import { INITIAL_FILES, WORKSPACE_NAME } from "../../config/code";
import type { FileContent } from "../../config/code";
import { useWindowsStore } from "../../store/windows";
import ActivityBar from "./ActivityBar";
import FileExplorer from "./FileExplorer";
import EditorTabs from "./EditorTabs";
import Breadcrumbs from "./Breadcrumbs";
import StatusBar from "./StatusBar";
import WelcomeScreen from "./WelcomeScreen";
import MarkdownPreview from "./MarkdownPreview";

export default function CodeContent() {
  const [files, setFiles] = useState<FileContent[]>(INITIAL_FILES);
  const [openTabIds, setOpenTabIds] = useState<string[]>(() =>
    INITIAL_FILES.map((f) => f.id),
  );
  const [activeFileId, setActiveFileId] = useState(INITIAL_FILES[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const [explorerVisible, setExplorerVisible] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );
  const [explorerWidth, setExplorerWidth] = useState(200);

  const editorViewRef = useRef<EditorView | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const scrollSourceRef = useRef<"editor" | "preview" | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFileData = files.find((f) => f.id === activeFileId) ?? files[0];
  const isMarkdown = activeFileData?.name.endsWith(".md") ?? false;
  const hasOpenTabs = openTabIds.length > 0;

  const patchWindow = useWindowsStore((s) => s.patchWindow);

  useEffect(() => {
    const fileName = hasOpenTabs ? activeFileData.name : null;
    const title = fileName ? `${fileName} - ${WORKSPACE_NAME} - Code` : "Code";
    patchWindow("code", { title });
  }, [activeFileData.name, hasOpenTabs, patchWindow]);

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabIds((prev) => {
      const next = prev.filter((id) => id !== tabId);
      if (tabId === activeFileId && next.length > 0) {
        const closedIdx = prev.indexOf(tabId);
        setActiveFileId(next[Math.min(closedIdx, next.length - 1)]);
      }
      if (next.length === 0) {
        setShowPreview(false);
      }
      return next;
    });
  };

  const handleEditorView = useCallback((view: EditorView) => {
    editorViewRef.current = view;
  }, []);

  // Bidirectional proportional scroll sync
  useEffect(() => {
    const editorScroller = editorViewRef.current?.scrollDOM;
    const previewEl = previewRef.current;
    if (!editorScroller || !previewEl || !showPreview || !isMarkdown) return;

    const claimSource = (source: "editor" | "preview") => {
      scrollSourceRef.current = source;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        scrollSourceRef.current = null;
      }, 60);
    };

    const onEditorScroll = () => {
      if (scrollSourceRef.current === "preview") return;
      claimSource("editor");
      const maxScroll =
        editorScroller.scrollHeight - editorScroller.clientHeight;
      if (maxScroll <= 0) return;
      const ratio = editorScroller.scrollTop / maxScroll;
      const previewMax = previewEl.scrollHeight - previewEl.clientHeight;
      if (previewMax > 0) previewEl.scrollTop = ratio * previewMax;
    };

    const onPreviewScroll = () => {
      if (scrollSourceRef.current === "editor") return;
      claimSource("preview");
      const maxScroll = previewEl.scrollHeight - previewEl.clientHeight;
      if (maxScroll <= 0) return;
      const ratio = previewEl.scrollTop / maxScroll;
      const editorMax =
        editorScroller.scrollHeight - editorScroller.clientHeight;
      if (editorMax > 0) editorScroller.scrollTop = ratio * editorMax;
    };

    editorScroller.addEventListener("scroll", onEditorScroll, {
      passive: true,
    });
    previewEl.addEventListener("scroll", onPreviewScroll, { passive: true });
    return () => {
      editorScroller.removeEventListener("scroll", onEditorScroll);
      previewEl.removeEventListener("scroll", onPreviewScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [showPreview, isMarkdown]);

  const tabs = openTabIds
    .map((id) => files.find((f) => f.id === id))
    .filter((f): f is FileContent => f != null)
    .map((f) => ({ id: f.id, name: f.name }));

  const handleSidebarSelect = (name: string) => {
    const file = files.find((f) => f.name === name);
    if (file) {
      if (!openTabIds.includes(file.id)) {
        setOpenTabIds((prev) => [...prev, file.id]);
      }
      setActiveFileId(file.id);
    }
  };

  const handleEditorChange = (value: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: value } : f)),
    );
  };

  const toggleExplorer = useCallback(() => {
    setExplorerVisible((v) => !v);
  }, []);

  const handleExplorerResizeStart = (e: ReactPointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = explorerWidth;

    const onPointerMove = (moveEvent: globalThis.PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      setExplorerWidth(Math.min(500, Math.max(120, startWidth + delta)));
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-[Ubuntu,Segoe_UI,sans-serif]">
      <div className="flex flex-1 min-h-0">
        <ActivityBar
          explorerVisible={explorerVisible}
          onToggleExplorer={toggleExplorer}
        />

        {explorerVisible && (
          <>
            <FileExplorer
              activeFileName={activeFileData.name}
              onSelectFile={handleSidebarSelect}
              width={explorerWidth}
            />
            {/* Resize handle */}
            <div
              onPointerDown={handleExplorerResizeStart}
              className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-[#007acc] transition-colors duration-150"
            />
          </>
        )}

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorTabs
            tabs={tabs}
            activeFileId={activeFileId}
            activeFileName={activeFileData.name}
            isMarkdown={isMarkdown}
            showPreview={showPreview}
            onSelectTab={setActiveFileId}
            onCloseTab={handleCloseTab}
            onTogglePreview={() => setShowPreview((p) => !p)}
          />

          {hasOpenTabs && <Breadcrumbs activeFileName={activeFileData.name} />}

          {hasOpenTabs ? (
            <div className="flex-1 min-h-0 min-w-0 flex flex-row">
              <div className="flex-1 min-h-0 min-w-0 flex flex-col">
                <MarkdownEditor
                  value={activeFileData.content}
                  onChange={handleEditorChange}
                  onEditorView={handleEditorView}
                />
              </div>

              {showPreview && isMarkdown && activeFileData && (
                <MarkdownPreview
                  ref={previewRef}
                  content={activeFileData.content}
                />
              )}
            </div>
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>

      <StatusBar activeFileName={activeFileData.name} />
    </div>
  );
}
