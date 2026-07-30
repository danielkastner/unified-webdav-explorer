import React from 'react';
import { HardDriveDownload, Sun, Moon, Server, Monitor, Laptop, Check } from 'lucide-react';
import { WebDavEndpoint, AppSettings } from '../types';

interface DesktopTitleBarProps {
  endpoints: WebDavEndpoint[];
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onOpenEndpointsModal: () => void;
  onOpenElectronGuide: () => void;
  activeTabCount: number;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({
  endpoints,
  settings,
  onUpdateSettings,
  onOpenEndpointsModal,
  onOpenElectronGuide,
  activeTabCount,
}) => {
  const activeCount = endpoints.filter((e) => e.enabled).length;
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  const toggleTheme = () => {
    const nextTheme = settings.themeMode === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ themeMode: nextTheme });
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <div className="h-10 bg-[#E7E2DB] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5] select-none flex items-center justify-between px-3 text-xs border-b border-[#D0C8BD] dark:border-[#49454F] z-50 transition-colors">
      {/* Left: Window Controls (macOS / Electron style native handlers) */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 group">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer"
            title="Close Window"
          />
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer"
            title="Minimize Window"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
            title="Maximize Window"
          />
        </div>

        <div className="h-4 w-px bg-[#D0C8BD] dark:bg-[#49454F] mx-1" />

        {/* App Title & Icon */}
        <div className="flex items-center space-x-2 font-medium tracking-tight">
          <div className="p-1 rounded-lg bg-[#C85A17]/15 dark:bg-[#D0BCFF]/20 text-[#C85A17] dark:text-[#D0BCFF]">
            <HardDriveDownload className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[#2C221E] dark:text-[#E6E1E5]">NexusDrive</span>
          <span className="text-[10px] bg-[#D0C8BD]/60 dark:bg-[#49454F] text-[#C85A17] dark:text-[#D0BCFF] px-2 py-0.5 rounded-full border border-[#D0C8BD] dark:border-[#49454F] font-medium">
            {isElectron ? 'Electron Desktop' : 'Web + Electron Ready'}
          </span>
        </div>
      </div>

      {/* Middle: Connection Status Banner & Electron Guide Button */}
      <div className="hidden md:flex items-center space-x-2">
        <button
          onClick={onOpenEndpointsModal}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFD9CE] dark:bg-[#49454F]/60 hover:bg-[#D0C8BD] dark:hover:bg-[#49454F] text-[#2C221E] dark:text-[#E6E1E5] transition-all border border-[#C8C0B3] dark:border-[#49454F] cursor-pointer"
        >
          <Server className="w-3 h-3 text-[#C85A17] dark:text-[#D0BCFF]" />
          <span className="font-medium text-xs">
            {activeCount} of {endpoints.length} Endpoints Merged
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          onClick={onOpenElectronGuide}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            isElectron
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
              : 'bg-[#FCEEE6] dark:bg-[#381E72]/80 hover:bg-[#F8E2D4] dark:hover:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF] border-[#E89E6C] dark:border-[#D0BCFF]/40 shadow-xs'
          }`}
          title="Configure & Run as Native Desktop App via Electron"
        >
          <Laptop className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#D0BCFF]" />
          <span>{isElectron ? 'Electron Active' : 'Run on Desktop (Electron)'}</span>
        </button>
      </div>

      {/* Right: Quick Settings & Theme Switcher */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenElectronGuide}
          className="md:hidden p-1.5 rounded-full bg-[#FCEEE6] dark:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF] cursor-pointer border border-[#E89E6C] dark:border-[#381E72]"
          title="Electron Desktop Setup"
        >
          <Laptop className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] transition-colors cursor-pointer flex items-center space-x-1"
          title={`Switch Theme (Current: ${settings.themeMode})`}
        >
          {settings.themeMode === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-[#D0BCFF]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[#D97706]" />
          )}
          <span className="capitalize text-[11px] font-semibold hidden sm:inline">
            {settings.themeMode}
          </span>
        </button>
      </div>
    </div>
  );
};

