import NavigationBar from "./NavigationBar";
import NewTabPage from "./NewTabPage";

// ─── Orchestrator ──────────────────────────────────────────────────────────────

/**
 * BrowserContent renders a static new-tab experience.
 *
 * - NavigationBar: decorative chrome with a functional URL input that opens
 *   addresses in a real browser tab.
 * - NewTabPage: shortcut tiles (GitHub, LinkedIn) and a search bar, both
 *   opening links in real browser tabs.
 *
 * Each child is fully self-contained (local state + own event handlers),
 * so the orchestrator has zero props and zero shared state.
 */
export default function BrowserContent() {
  return (
    <div className="flex flex-col h-full bg-[#1c1b22]">
      <NavigationBar />
      <NewTabPage />
    </div>
  );
}
