import React from 'react';
import {
  X,
  Settings,
  Sliders,
  Moon,
  Sun,
  Monitor,
  Zap,
  Shield,
  Database,
  Terminal,
  Download,
  Film,
  Tv,
  FolderPlus,
  Palette,
  RefreshCw,
  Clock,
  LayoutGrid,
  Table,
  Layers,
  Eye,
  Server,
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetDemoData: () => void;
}

type TabType = 'appearance' | 'behavior' | 'media' | 'system';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = React.useState<TabType>('appearance');

  const [form, setForm] = React.useState<AppSettings>({
    ...settings,
    movieDirectories: settings.movieDirectories || ['/Movies'],
    tvShowDirectories: settings.tvShowDirectories || ['/TV-Shows'],
  });

  const [movieDirsText, setMovieDirsText] = React.useState<string>(
    (settings.movieDirectories || ['/Movies']).join(', ')
  );
  const [tvDirsText, setTvDirsText] = React.useState<string>(
    (settings.tvShowDirectories || ['/TV-Shows']).join(', ')
  );

  const handleMovieDirsChange = (text: string) => {
    setMovieDirsText(text);
    const parsed = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => (p.startsWith('/') ? p : '/' + p));
    setForm((prev) => ({ ...prev, movieDirectories: parsed }));
  };

  const handleTvDirsChange = (text: string) => {
    setTvDirsText(text);
    const parsed = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => (p.startsWith('/') ? p : '/' + p));
    setForm((prev) => ({ ...prev, tvShowDirectories: parsed }));
  };

  const addMoviePreset = (dir: string) => {
    const current = form.movieDirectories || [];
    if (!current.includes(dir)) {
      const next = [...current, dir];
      setForm((prev) => ({ ...prev, movieDirectories: next }));
      setMovieDirsText(next.join(', '));
    }
  };

  const addTvPreset = (dir: string) => {
    const current = form.tvShowDirectories || [];
    if (!current.includes(dir)) {
      const next = [...current, dir];
      setForm((prev) => ({ ...prev, tvShowDirectories: next }));
      setTvDirsText(next.join(', '));
    }
  };

  const handleSave = () => {
    onSaveSettings(form);
    onClose();
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'behavior',
      label: 'Sync & Downloads',
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: 'media',
      label: 'TMDB & Media',
      icon: <Film className="w-4 h-4" />,
    },
    {
      id: 'system',
      label: 'System & Reset',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col select-none transition-colors max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D8D2C9] dark:border-[#49454F] flex items-center justify-between bg-[#F0EEEB] dark:bg-[#1C1B1F]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-[#E7E2DB] dark:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C221E] dark:text-[#E6E1E5]">
                Application Settings
              </h3>
              <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                Preferences, theme settings & WebDAV merge configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] text-[#786C63] dark:text-[#CAC4D0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-[#F5F2ED] dark:bg-[#25232A] border-b border-[#D8D2C9] dark:border-[#49454F] flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-t-2xl font-medium text-xs flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap border-t border-x ${
                  isActive
                    ? 'bg-[#FAF8F5] dark:bg-[#2B2930] border-[#D8D2C9] dark:border-[#49454F] text-[#C85A17] dark:text-[#D0BCFF] font-semibold -mb-px shadow-xs'
                    : 'border-transparent text-[#786C63] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] hover:bg-[#E7E2DB]/50 dark:hover:bg-[#381E72]/20'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Area */}
        <div className="p-6 text-xs overflow-y-auto flex-1">
          {/* TAB 1: APPEARANCE (2 Columns) */}
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
              {/* Column 1: Theme & View Mode */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div>
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                      Material Design 3 Theme
                    </label>
                    <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                      Choose your preferred visual theme for the file manager interface.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-[#C85A17]" /> },
                      { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-[#D0BCFF]" /> },
                      { mode: 'system', label: 'System', icon: <Monitor className="w-4 h-4 text-[#786C63]" /> },
                    ].map((item) => (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => setForm({ ...form, themeMode: item.mode as any })}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                          form.themeMode === item.mode
                            ? 'bg-amber-500/15 dark:bg-[#381E72] border-[#C85A17] dark:border-[#D0BCFF] text-[#2C221E] dark:text-[#E6E1E5] font-bold ring-1 ring-[#C85A17] dark:ring-[#D0BCFF]'
                            : 'bg-white dark:bg-[#2B2930] border-[#D8D2C9] dark:border-[#49454F] text-[#6E6259] dark:text-[#CAC4D0] hover:bg-[#E7E2DB] dark:hover:bg-[#312E37]'
                        }`}
                      >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div>
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                      Default File View Mode
                    </label>
                    <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                      Initial layout used when navigating folders across endpoints.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" /> },
                      { mode: 'table', label: 'Table', icon: <Table className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" /> },
                      { mode: 'cards', label: 'Cards', icon: <Layers className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" /> },
                    ].map((item) => (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => setForm({ ...form, defaultViewMode: item.mode as any })}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                          form.defaultViewMode === item.mode
                            ? 'bg-amber-500/15 dark:bg-[#381E72] border-[#C85A17] dark:border-[#D0BCFF] text-[#2C221E] dark:text-[#E6E1E5] font-bold ring-1 ring-[#C85A17] dark:ring-[#D0BCFF]'
                            : 'bg-white dark:bg-[#2B2930] border-[#D8D2C9] dark:border-[#49454F] text-[#6E6259] dark:text-[#CAC4D0] hover:bg-[#E7E2DB] dark:hover:bg-[#312E37]'
                        }`}
                      >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Layout Options & Toggles */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div>
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                      Display Options & Density
                    </label>
                    <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                      Fine-tune density and visibility settings for folder listings.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[#D8D2C9] dark:border-[#49454F] bg-white dark:bg-[#2B2930] cursor-pointer hover:bg-[#F5F2ED] dark:hover:bg-[#312E37] transition-colors">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block text-xs">
                          Compact UI Mode
                        </span>
                        <span className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] block">
                          Reduce padding in file lists & table view rows
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.compactMode}
                        onChange={(e) => setForm({ ...form, compactMode: e.target.checked })}
                        className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-[#D8D2C9] dark:border-[#49454F] bg-white dark:bg-[#2B2930] cursor-pointer hover:bg-[#F5F2ED] dark:hover:bg-[#312E37] transition-colors">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block text-xs flex items-center space-x-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#D0BCFF]" />
                          <span>Show Hidden Files</span>
                        </span>
                        <span className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] block">
                          Display dotfiles (e.g. <code className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">.gitignore</code>, <code className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">.env</code>)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.showHiddenFiles}
                        onChange={(e) => setForm({ ...form, showHiddenFiles: e.target.checked })}
                        className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BEHAVIOR / SYNC & DOWNLOADS (2 Columns) */}
          {activeTab === 'behavior' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
              {/* Column 1: Duplicate Strategy & Auto Refresh */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div>
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                      Duplicate Detection Strategy
                    </label>
                    <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                      Control how files across WebDAV endpoints are merged as duplicates.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.duplicateDetectionMode === 'exact_path'
                        ? 'bg-amber-500/10 dark:bg-[#381E72]/40 border-[#C85A17] dark:border-[#D0BCFF]'
                        : 'border-[#D8D2C9] dark:border-[#49454F] bg-white dark:bg-[#2B2930]'
                    }`}>
                      <input
                        type="radio"
                        name="dupMode"
                        checked={form.duplicateDetectionMode === 'exact_path'}
                        onChange={() => setForm({ ...form, duplicateDetectionMode: 'exact_path' })}
                        className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">Exact Path Match (Strict)</p>
                        <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                          Merged only at identical relative paths (e.g. <code className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">/Docs/Report.pdf</code>).
                        </p>
                      </div>
                    </label>

                    <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.duplicateDetectionMode === 'filename_only'
                        ? 'bg-amber-500/10 dark:bg-[#381E72]/40 border-[#C85A17] dark:border-[#D0BCFF]'
                        : 'border-[#D8D2C9] dark:border-[#49454F] bg-white dark:bg-[#2B2930]'
                    }`}>
                      <input
                        type="radio"
                        name="dupMode"
                        checked={form.duplicateDetectionMode === 'filename_only'}
                        onChange={() => setForm({ ...form, duplicateDetectionMode: 'filename_only' })}
                        className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">Filename Match Anywhere</p>
                        <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                          Files with matching names across any endpoint folder are grouped.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div>
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                      Auto-Refresh Sync Interval
                    </label>
                    <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                      Automatically re-index WebDAV endpoints in background.
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { sec: 0, label: 'Off' },
                      { sec: 30, label: '30s' },
                      { sec: 60, label: '1m' },
                      { sec: 300, label: '5m' },
                    ].map((item) => (
                      <button
                        key={item.sec}
                        type="button"
                        onClick={() => setForm({ ...form, autoRefreshInterval: item.sec })}
                        className={`p-2 rounded-xl border font-semibold text-xs cursor-pointer transition-all text-center ${
                          form.autoRefreshInterval === item.sec
                            ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72] border-[#C85A17] dark:border-[#D0BCFF]'
                            : 'bg-white dark:bg-[#2B2930] border-[#D8D2C9] dark:border-[#49454F] text-[#2C221E] dark:text-[#E6E1E5] hover:bg-[#E7E2DB] dark:hover:bg-[#312E37]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Download Command & Shell Timeout */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                      Download Command Template
                    </label>
                  </div>
                  <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                    Bash template for local downloads. Use <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{LOCAL_PATH}`}</code> and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{URL}`}</code>.
                  </p>

                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={form.downloadCommand ?? 'curl -s -L -o "{LOCAL_PATH}" "{URL}"'}
                      onChange={(e) => setForm({ ...form, downloadCommand: e.target.value })}
                      placeholder='curl -s -L -o "{LOCAL_PATH}" "{URL}"'
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                    />

                    <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">CLI Presets:</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, downloadCommand: 'curl -s -L -o "{LOCAL_PATH}" "{URL}"' })}
                        className="px-2 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        curl
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, downloadCommand: 'wget -O "{LOCAL_PATH}" "{URL}"' })}
                        className="px-2 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        wget
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, downloadCommand: 'aria2c -o "{LOCAL_PATH}" "{URL}"' })}
                        className="px-2 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        aria2c
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                      Shell Execution Timeout
                    </label>
                  </div>
                  <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                    Maximum execution duration before background shell tasks are killed.
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={Math.round((form.execTimeoutSeconds ?? 300) / 60)}
                        onChange={(e) => {
                          const mins = Math.max(1, parseInt(e.target.value) || 1);
                          setForm({ ...form, execTimeoutSeconds: mins * 60 });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                      />
                      <span className="absolute right-3 text-xs text-[#786C63] dark:text-[#938F99] pointer-events-none font-medium">
                        Minutes ({form.execTimeoutSeconds ?? 300}s)
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 flex-wrap pt-0.5">
                      <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">Presets:</span>
                      {[
                        { mins: 1, label: '1m' },
                        { mins: 5, label: '5m (Default)' },
                        { mins: 10, label: '10m' },
                        { mins: 15, label: '15m' },
                        { mins: 30, label: '30m' },
                      ].map((preset) => (
                        <button
                          key={preset.mins}
                          type="button"
                          onClick={() => setForm({ ...form, execTimeoutSeconds: preset.mins * 60 })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
                            (form.execTimeoutSeconds ?? 300) === preset.mins * 60
                              ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72]'
                              : 'bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[#2C221E] dark:text-[#E6E1E5]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & TMDB (2 Columns) */}
          {activeTab === 'media' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
              {/* Column 1: Movie Directories */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-2 text-sm">
                    <Film className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Movie Folder Paths</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-semibold">
                    TMDB Movie
                  </span>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                  Paths that trigger movie metadata indexing & poster downloads.
                </p>
                <input
                  type="text"
                  value={movieDirsText}
                  onChange={(e) => handleMovieDirsChange(e.target.value)}
                  placeholder="/Movies, /Films, /Media/Movies"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                />
                <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Quick Add:</span>
                  {['/Movies', '/Films', '/Media/Movies'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addMoviePreset(preset)}
                      className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2: TV Shows Directories & Watch Command */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-2 text-sm">
                      <Tv className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>TV-Show Folder Paths</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-semibold">
                      TMDB TV
                    </span>
                  </div>
                  <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                    Paths that trigger TV show series metadata auto-fetching.
                  </p>
                  <input
                    type="text"
                    value={tvDirsText}
                    onChange={(e) => handleTvDirsChange(e.target.value)}
                    placeholder="/TV-Shows, /Series, /Shows"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                  />
                  <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Quick Add:</span>
                    {['/TV-Shows', '/Series', '/Shows'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addTvPreset(preset)}
                        className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                    <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                      Watch / Stream Command
                    </label>
                  </div>
                  <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                    Template copied to clipboard on "Watch Movie". Use <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{URL}`}</code> and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{TITLE}`}</code>.
                  </p>

                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={form.watchCommand ?? 'vlc "{URL}" --title "{TITLE}"'}
                      onChange={(e) => setForm({ ...form, watchCommand: e.target.value })}
                      placeholder='vlc "{URL}" --title "{TITLE}"'
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                    />

                    <div className="flex items-center space-x-1 flex-wrap pt-0.5">
                      <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">Player Presets:</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, watchCommand: 'vlc "{URL}" --title "{TITLE}"' })}
                        className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        vlc
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, watchCommand: 'mpv --title="{TITLE}" "{URL}"' })}
                        className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        mpv
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, watchCommand: 'iina "{URL}"' })}
                        className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        iina
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, watchCommand: 'ffplay -window_title "{TITLE}" "{URL}"' })}
                        className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                      >
                        ffplay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM & DATA RESET (2 Columns) */}
          {activeTab === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
              {/* Column 1: Mock WebDAV Server Mode */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                    Mock WebDAV Environment
                  </label>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                  Enable virtual sample WebDAV endpoints to test directory merging. When set to false, demo endpoints and demo favorites are hidden from all endpoint listings, navigation drawer, and unified views.
                </p>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#D8D2C9] dark:border-[#49454F] bg-white dark:bg-[#2B2930] cursor-pointer hover:bg-[#F5F2ED] dark:hover:bg-[#312E37] transition-colors mt-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block text-xs">
                      Virtual Sample Endpoints Mode
                    </span>
                    <span className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] block">
                      Mounts Server-Alpha, Server-Beta & Backup-Gamma
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.mockServerEnabled}
                    onChange={(e) => setForm({ ...form, mockServerEnabled: e.target.checked })}
                    className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Column 2: Demo Reset */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <RefreshCw className="w-4 h-4" />
                  <span>Factory Reset Demo Data</span>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                  Restores initial sample endpoints (Server-Alpha, Server-Beta, Backup-Gamma) and default files across Movies, TV-Shows, Documents, and Projects.
                </p>
                <button
                  type="button"
                  onClick={onResetDemoData}
                  className="px-4 py-2 rounded-2xl bg-[#C85A17] text-white hover:bg-[#A1470A] dark:bg-[#D0BCFF] dark:text-[#381E72] dark:hover:bg-[#E8DEF8] font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Reset Demo Data & Endpoints Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D8D2C9] dark:border-[#49454F] flex justify-end space-x-2 bg-[#F0EEEB] dark:bg-[#1C1B1F]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-[#786C63] dark:text-[#CAC4D0] hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-[#C85A17] hover:bg-[#A1470A] text-white dark:bg-[#D0BCFF] dark:hover:bg-[#E8DEF8] dark:text-[#381E72] font-semibold shadow-xs cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};


