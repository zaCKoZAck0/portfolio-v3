import TopBar from "./components/TopBar";
import Dock from "./components/Dock";
import Desktop from "./components/Desktop";

function App() {
  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col relative bg-cover bg-center"
      style={{ backgroundImage: "url('/ubuntu_wallpaper.jpg')" }}
    >
      <TopBar />
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <Dock />
        <Desktop />
      </div>
    </div>
  );
}

export default App;
