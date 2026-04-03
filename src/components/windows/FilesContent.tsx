import {
  Star,
  Home,
  FileText,
  Download,
  Music,
  Image,
  Video,
  Trash2,
  HardDrive,
  Plus,
  Search,
  FolderOpen,
} from 'lucide-react';

const sidebarItems = [
  { icon: Star, label: 'Recent', active: false },
  { icon: Star, label: 'Starred', active: false },
  { icon: Home, label: 'Home', active: true },
  { icon: FileText, label: 'Documents', active: false },
  { icon: Download, label: 'Downloads', active: false },
  { icon: Music, label: 'Music', active: false },
  { icon: Image, label: 'Pictures', active: false },
  { icon: Video, label: 'Videos', active: false },
  { icon: Trash2, label: 'Trash', active: false },
];

const otherLocations = [
  { icon: HardDrive, label: 'VBox_GAs...', locked: true },
  { icon: Plus, label: 'Other Locations', active: false },
];

const homeFiles = [
  { name: 'Desktop', color: '#e95420' },
  { name: 'Documents', color: '#77216f' },
  { name: 'Downloads', color: '#77216f' },
  { name: 'Music', color: '#77216f' },
  { name: 'Pictures', color: '#77216f' },
  { name: 'Public', color: '#77216f' },
  { name: 'snap', color: '#e95420' },
  { name: 'Templates', color: '#77216f' },
  { name: 'Videos', color: '#77216f' },
];

export default function FilesContent() {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-[170px] bg-[#353535] border-r border-white/5 flex flex-col py-2 text-[13px] shrink-0">
        {/* Search + title */}
        <div className="flex items-center gap-2 px-3 pb-2 border-b border-white/5 mb-1">
          <Search className="w-4 h-4 text-white/50" />
          <span className="text-white/80 font-medium">Files</span>
        </div>

        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-1.5 mx-1 rounded cursor-pointer transition-colors ${
                item.active
                  ? 'bg-[#e95420]/30 text-white'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}

        <div className="mt-2 border-t border-white/5 pt-2">
          {otherLocations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded cursor-pointer text-white/70 hover:bg-white/5 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span className="truncate text-[13px]">{item.label}</span>
                {item.locked && (
                  <span className="ml-auto text-white/30 text-[10px]">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Path bar */}
        <div className="h-9 bg-[#383838] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
          <Home className="w-4 h-4 text-white/50" />
          <span className="text-[13px] text-white/70">Home</span>
        </div>

        {/* File grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-6 gap-4">
            {homeFiles.map((file) => (
              <div
                key={file.name}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-16 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: file.color + '30' }}
                >
                  <FolderOpen className="w-8 h-8" style={{ color: file.color }} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] text-white/80 text-center truncate w-full">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
