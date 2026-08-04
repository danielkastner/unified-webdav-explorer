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

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
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
      <div className="bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col select-none transition-colors max-h-[90vh]">
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
        <div className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                  Material Design 3 Theme
                </label>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] mb-3">
                  Choose your preferred visual theme for the unified file manager interface.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { mode: 'light', label: 'Light Mode', icon: <Sun className="w-5 h-5 text-[#C85A17]" />, desc: 'Warm warm-toned palette' },
                    { mode: 'dark', label: 'Dark Mode', icon: <Moon className="w-5 h-5 text-[#D0BCFF]" />, desc: 'Comfortable dark palette' },
                    { mode: 'system', label: 'System Default', icon: <Monitor className="w-5 h-5 text-[#786C63]" />, desc: 'Follow OS preference' },
                  ].map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setForm({ ...form, themeMode: item.mode as any })}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        form.themeMode === item.mode
                          ? 'bg-amber-500/15 dark:bg-[#381E72] border-[#C85A17] dark:border-[#D0BCFF] text-[#2C221E] dark:text-[#E6E1E5] font-semibold ring-1 ring-[#C85A17] dark:ring-[#D0BCFF]'
                          : 'bg-[#FAF8F5] dark:bg-[#1C1B1F] border-[#D8D2C9] dark:border-[#49454F] text-[#6E6259] dark:text-[#CAC4D0] hover:bg-[#E7E2DB] dark:hover:bg-[#312E37]'
                      }`}
                    >
                      {item.icon}
                      <span className="font-bold">{item.label}</span>
                      <span className="text-[10px] text-[#786C63] dark:text-[#938F99] text-center">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BEHAVIOR / SYNC & DOWNLOADS */}
          {activeTab === 'behavior' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Duplicate Detection Mode */}
              <div className="space-y-2">
                <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block">
                  Duplicate Detection Strategy
                </label>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                  Control how files across multiple WebDAV endpoints are identified as duplicates.
                </p>
                <div className="space-y-2 pt-1">
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    form.duplicateDetectionMode === 'exact_path'
                      ? 'bg-amber-500/10 dark:bg-[#381E72]/40 border-[#C85A17] dark:border-[#D0BCFF]'
                      : 'border-[#D8D2C9] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F]'
                  }`}>
                    <input
                      type="radio"
                      name="dupMode"
                      checked={form.duplicateDetectionMode === 'exact_path'}
                      onChange={() => setForm({ ...form, duplicateDetectionMode: 'exact_path' })}
                      className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">Exact Directory Path Match (Strict)</p>
                      <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                        Files are merged only if they exist at the identical relative path (e.g. <code className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">/Documents/Report.pdf</code> on multiple servers).
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    form.duplicateDetectionMode === 'filename_only'
                      ? 'bg-amber-500/10 dark:bg-[#381E72]/40 border-[#C85A17] dark:border-[#D0BCFF]'
                      : 'border-[#D8D2C9] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F]'
                  }`}>
                    <input
                      type="radio"
                      name="dupMode"
                      checked={form.duplicateDetectionMode === 'filename_only'}
                      onChange={() => setForm({ ...form, duplicateDetectionMode: 'filename_only' })}
                      className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">Filename Match Across Any Folder</p>
                      <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                        Files with matching names across any directory on different WebDAV endpoints will be grouped as duplicate candidates.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Configurable Download Command */}
              <div className="space-y-2 pt-3 border-t border-[#D8D2C9] dark:border-[#49454F]">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                    Download Shell Command Template
                  </label>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                  Configurable bash template used for single & bulk downloads in Electron local shell actions.
                  Use <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{LOCAL_PATH}`}</code> for output path and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{URL}`}</code> for the remote file link.
                </p>

                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={form.downloadCommand ?? 'curl -s -L -o "{LOCAL_PATH}" "{URL}"'}
                    onChange={(e) => setForm({ ...form, downloadCommand: e.target.value })}
                    placeholder='curl -s -L -o "{LOCAL_PATH}" "{URL}"'
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                  />

                  <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">CLI Presets:</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, downloadCommand: 'curl -s -L -o "{LOCAL_PATH}" "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      curl
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, downloadCommand: 'wget -O "{LOCAL_PATH}" "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      wget
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, downloadCommand: 'aria2c -o "{LOCAL_PATH}" "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      aria2c
                    </button>
                  </div>
                </div>
              </div>

              {/* Configurable Watch / Streaming Command */}
              <div className="space-y-2 pt-3 border-t border-[#D8D2C9] dark:border-[#49454F]">
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                    Watch / Stream Command Template
                  </label>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                  Configurable command template copied to clipboard when clicking "Watch Movie / Stream".
                  Use <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{URL}`}</code> for the HTTP video preview stream link and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{TITLE}`}</code> for movie title.
                </p>

                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={form.watchCommand ?? 'vlc "{URL}" --title "{TITLE}"'}
                    onChange={(e) => setForm({ ...form, watchCommand: e.target.value })}
                    placeholder='vlc "{URL}" --title "{TITLE}"'
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                  />

                  <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">Player Presets:</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, watchCommand: 'vlc "{URL}" --title "{TITLE}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      vlc
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, watchCommand: 'mpv --title="{TITLE}" "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      mpv
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, watchCommand: 'iina "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      iina (macOS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, watchCommand: 'ffplay -window_title "{TITLE}" "{URL}"' })}
                      className="px-2.5 py-1 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono font-semibold text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                    >
                      ffplay
                    </button>
                  </div>
                </div>
              </div>

              {/* Configurable Shell Command Timeout */}
              <div className="space-y-2 pt-3 border-t border-[#D8D2C9] dark:border-[#49454F]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm">
                    Shell Command Execution Timeout
                  </label>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                  Maximum allowed execution duration before a long-running download or shell process is automatically killed by the system. (Default: 5 minutes)
                </p>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
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
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                        />
                        <span className="absolute right-3 text-xs text-[#786C63] dark:text-[#938F99] pointer-events-none font-medium">
                          Minutes ({form.execTimeoutSeconds ?? 300}s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">Presets:</span>
                    {[
                      { mins: 1, label: '1 min' },
                      { mins: 5, label: '5 min (Default)' },
                      { mins: 10, label: '10 min' },
                      { mins: 15, label: '15 min' },
                      { mins: 30, label: '30 min' },
                    ].map((preset) => (
                      <button
                        key={preset.mins}
                        type="button"
                        onClick={() => setForm({ ...form, execTimeoutSeconds: preset.mins * 60 })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
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
          )}

          {/* TAB 3: MEDIA & TMDB */}
          {activeTab === 'media' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm flex items-center space-x-2">
                  <Film className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <span>TMDB Metadata Auto-Fetch Directories</span>
                </label>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                  Configure specific WebDAV folder paths that trigger TMDB metadata indexing. Video files in these folders automatically query TMDB and generate sidecar JSON files.
                </p>
              </div>

              {/* Movies Directories */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-2">
                    <Film className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Movie Folder Paths</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                    TMDB Movie API
                  </span>
                </div>
                <input
                  type="text"
                  value={movieDirsText}
                  onChange={(e) => handleMovieDirsChange(e.target.value)}
                  placeholder="/Movies, /Films, /Media/Movies"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                />
                <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Quick Add Presets:</span>
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

              {/* TV-Shows Directories */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-2">
                    <Tv className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>TV-Show Folder Paths</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                    TMDB TV Show API
                  </span>
                </div>
                <input
                  type="text"
                  value={tvDirsText}
                  onChange={(e) => handleTvDirsChange(e.target.value)}
                  placeholder="/TV-Shows, /Series, /Shows"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
                />
                <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Quick Add Presets:</span>
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
            </div>
          )}

          {/* TAB 4: SYSTEM & DATA RESET */}
          {activeTab === 'system' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] text-sm block mb-1">
                  System Diagnostics & Demo Reset
                </label>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] mb-3">
                  Manage initial mock server state and restore default sample WebDAV endpoints, duplicate files, and movie metadata.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold">
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Mock WebDAV Environment</span>
                </div>
                <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
                  Restores the initial sample endpoints (Server-Alpha, Server-Beta, Backup-Gamma) and default files across Movies, TV-Shows, Documents, and Projects.
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

