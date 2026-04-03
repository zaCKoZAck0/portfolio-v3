import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscExtensions,
  VscSettings,
} from "./icons";

export default function ActivityBar({
  explorerVisible,
  onToggleExplorer,
}: {
  explorerVisible: boolean;
  onToggleExplorer: () => void;
}) {
  const items = [
    { icon: <VscFiles />, active: explorerVisible, onClick: onToggleExplorer },
    { icon: <VscSearch />, active: false },
    { icon: <VscSourceControl />, active: false },
    { icon: <VscExtensions />, active: false },
  ];

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center pt-1 shrink-0">
      {items.map((item, i) => (
        <div
          key={i}
          onClick={item.onClick}
          className={`w-12 h-12 flex items-center justify-center cursor-pointer border-l-2 ${
            item.active
              ? "border-white text-white"
              : "border-transparent text-[#858585] hover:text-white"
          }`}
        >
          {item.icon}
        </div>
      ))}
      <div className="mt-auto pb-1">
        <div className="w-12 h-12 flex items-center justify-center cursor-pointer text-[#858585] hover:text-white">
          <VscSettings />
        </div>
      </div>
    </div>
  );
}
