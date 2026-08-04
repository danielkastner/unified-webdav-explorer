import React from 'react';
import { X, Settings, Sliders, Moon, Sun, Monitor, Zap, Shield, Database, Terminal, Download, Film, Tv, FolderPlus } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

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
    const current = (form.movieDirectories || []);
    if (!current.includes(dir)) {
      const next = [...current, dir];
      setForm((prev) => ({ ...prev, movieDirectories: next }));
      setMovieDirsText(next.join(', '));
    }
  };

  const addTvPreset = (dir: string) => {
    const current = (form.tvShowDirectories || []);
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col select-none transition-colors">
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
                Material Design 3 preferences & WebDAV merge configuration
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

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Theme Mode */}
          <div className="space-y-2">
            <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block">
              Material Design 3 Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4 text-[#C85A17]" /> },
                { mode: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-[#D0BCFF]" /> },
                { mode: 'system', label: 'System Theme', icon: <Monitor className="w-4 h-4 text-[#786C63]" /> },
              ].map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setForm({ ...form, themeMode: item.mode as any })}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    form.themeMode === item.mode
                      ? 'bg-amber-500/15 dark:bg-[#381E72] border-[#C85A17] dark:border-[#D0BCFF] text-[#2C221E] dark:text-[#E6E1E5] font-semibold'
                      : 'bg-[#DFD9CE] dark:bg-[#1C1B1F] border-[#C8C0B3] dark:border-[#49454F] text-[#6E6259] dark:text-[#CAC4D0]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duplicate Detection Mode */}
          <div className="space-y-2 pt-2 border-t border-[#D8D2C9] dark:border-[#49454F]">
            <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block">
              Duplicate Detection Logic
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2.5 p-3 rounded-2xl border border-[#D8D2C9] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] cursor-pointer">
                <input
                  type="radio"
                  name="dupMode"
                  checked={form.duplicateDetectionMode === 'exact_path'}
                  onChange={() => setForm({ ...form, duplicateDetectionMode: 'exact_path' })}
                  className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#2C221E] dark:text-[#E6E1E5]">Exact Directory Path Match (Strict)</p>
                  <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0]">Files are merged only if they exist at the identical relative path (e.g. /Documents/Report.pdf on both servers).</p>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-2xl border border-[#D8D2C9] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] cursor-pointer">
                <input
                  type="radio"
                  name="dupMode"
                  checked={form.duplicateDetectionMode === 'filename_only'}
                  onChange={() => setForm({ ...form, duplicateDetectionMode: 'filename_only' })}
                  className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF] accent-[#C85A17] dark:accent-[#D0BCFF] cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#2C221E] dark:text-[#E6E1E5]">Filename Match across any folder</p>
                  <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0]">Files with the same name across any endpoint folder are flagged as duplicate candidates.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Configurable Download Command */}
          <div className="space-y-2 pt-2 border-t border-[#D8D2C9] dark:border-[#49454F]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
              <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">
                Download Shell Command Template
              </label>
            </div>
            <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] leading-relaxed">
              Configurable bash command executed for file downloads in Electron Bash Shell Actions.
              Use <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{LOCAL_PATH}`}</code> for the chosen local path and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">{`{URL}`}</code> for the endpoint file URL.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={form.downloadCommand ?? 'curl -s -L -o "{LOCAL_PATH}" "{URL}"'}
                onChange={(e) => setForm({ ...form, downloadCommand: e.target.value })}
                placeholder='curl -s -L -o "{LOCAL_PATH}" "{URL}"'
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
              />

              <div className="flex items-center space-x-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-medium text-[#786C63] dark:text-[#938F99]">Presets:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, downloadCommand: 'curl -s -L -o "{LOCAL_PATH}" "{URL}"' })}
                  className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                >
                  curl
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, downloadCommand: 'wget -O "{LOCAL_PATH}" "{URL}"' })}
                  className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                >
                  wget
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, downloadCommand: 'aria2c -o "{LOCAL_PATH}" "{URL}"' })}
                  className="px-2 py-0.5 rounded-lg bg-[#E7E2DB] dark:bg-[#3B383E] hover:bg-[#D8D2C9] dark:hover:bg-[#49454F] text-[10px] font-mono text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer"
                >
                  aria2c
                </button>
              </div>
            </div>
          </div>

          {/* TMDB Metadata Directories Configuration */}
          <div className="space-y-3 pt-2 border-t border-[#D8D2C9] dark:border-[#49454F]">
            <div>
              <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-2">
                <Film className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                <span>TMDB Metadata Auto-Fetch Directories</span>
              </label>
              <p className="text-[11px] text-[#786C63] dark:text-[#CAC4D0] mt-0.5">
                Configure specific directories to trigger TMDB metadata indexing. Files outside these directories will not fetch metadata automatically.
              </p>
            </div>

            {/* Movies Directories */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Movie Directories</span>
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
                  TMDB Movie API
                </span>
              </div>
              <input
                type="text"
                value={movieDirsText}
                onChange={(e) => handleMovieDirsChange(e.target.value)}
                placeholder="/Movies, /Films, /Media/Movies"
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
              />
              <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Presets:</span>
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
            <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2C221E] dark:text-[#E6E1E5] flex items-center space-x-1.5">
                  <Tv className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>TV-Show Directories</span>
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-medium">
                  TMDB TV Show API
                </span>
              </div>
              <input
                type="text"
                value={tvDirsText}
                onChange={(e) => handleTvDirsChange(e.target.value)}
                placeholder="/TV-Shows, /Series, /Shows"
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] font-mono text-xs text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF]"
              />
              <div className="flex items-center space-x-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-[#786C63] dark:text-[#938F99]">Presets:</span>
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

          {/* Demo Reset */}
          <div className="space-y-2 pt-2 border-t border-[#D8D2C9] dark:border-[#49454F]">
            <label className="font-bold text-[#2C221E] dark:text-[#E6E1E5] block">
              Demo Data Reset
            </label>
            <button
              type="button"
              onClick={onResetDemoData}
              className="px-4 py-2 rounded-2xl bg-[#DFD9CE] hover:bg-[#D0C8BD] dark:bg-[#1C1B1F] dark:hover:bg-[#3B383E] text-[#2C221E] dark:text-[#E6E1E5] font-semibold cursor-pointer border border-[#C8C0B3] dark:border-[#49454F]"
            >
              Reset Demo WebDAV Endpoints & Files
            </button>
          </div>
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
