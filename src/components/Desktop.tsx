import { useWindowsStore } from "../store/windows";
import Window from "./Window";
import { AnimatePresence } from "framer-motion";
import FilesContent from "./windows/FilesContent";
import CodeContent from "./windows/CodeContent";
import BrowserContent from "./browser";

function getWindowContent(id: string) {
  switch (id) {
    case "files":
      return <FilesContent />;
    case "code":
      return <CodeContent />;
    case "browser":
      return <BrowserContent />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-white/40 text-sm">
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </div>
      );
  }
}

export default function Desktop() {
  const windows = useWindowsStore((s) => s.windows);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const toggleMaximize = useWindowsStore((s) => s.toggleMaximize);

  return (
    <div className="flex-1 relative">
      <AnimatePresence>
        {Object.values(windows).map(
          (win) =>
            win.isOpen &&
            !win.isMinimized && (
              <Window
                key={win.id}
                id={win.id}
                title={win.title}
                x={win.position.x}
                y={win.position.y}
                width={win.size.width}
                height={win.size.height}
                zIndex={win.zIndex}
                isMaximized={win.isMaximized}
                onMinimize={() => minimizeWindow(win.id)}
                onClose={() => closeWindow(win.id)}
                onMaximize={() => toggleMaximize(win.id)}
              >
                {getWindowContent(win.id)}
              </Window>
            ),
        )}
      </AnimatePresence>
    </div>
  );
}
