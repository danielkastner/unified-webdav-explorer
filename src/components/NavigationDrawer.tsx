import React from 'react';
import {
  Folder,
  Star,
  Server,
  Settings,
  Plus,
  PanelLeftClose,
  PanelLeft,
  HardDrive,
  Layers,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Sparkles,
  FileText,
  BookmarkPlus
} from 'lucide-react';
import { WebDavEndpoint, FavoriteItem, AppSettings } from '../types';
import { formatBytes } from '../lib/webdavEngine';

interface NavigationDrawerProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  endpoints: WebDavEndpoint[];
  favorites: FavoriteItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenEndpointsModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleEndpoint: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
  onAddFavoriteFolder: () => void;
  duplicateCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isExpanded,
  onToggleExpand,
  endpoints,
  favorites,
  activePath,
  onNavigate,
  onOpenEndpointsModal,
  onOpenSettingsModal,
  onToggleEndpoint,
  onRemoveFavorite,
  onAddFavoriteFolder,
  duplicateCount,
}) => {
  // Calculate total combined storage across endpoints
  const totalUsed = endpoints.reduce((sum, ep) => sum + (ep.storageUsed || 0), 0);
  const totalQuota = endpoints.reduce((sum, ep) => sum + (ep.storageTotal || 0), 0);
  const quotaPercent = totalQuota > 0 ? Math.min(100, Math.round((totalUsed / totalQuota) * 100)) : 0;

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r border-[#D8D2C9] dark:border-[#49454F] flex flex-col z-30 select-none ${
        isExpanded ? 'w-64' : 'w-16'
      } bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]`}
    >
      {/* Top Drawer Header & Collapse Button */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#D8D2C9] dark:border-[#49454F]">
        {isExpanded && (
          <div className="flex items-center space-x-2 font-semibold text-sm tracking-tight text-[#C85A17] dark:text-[#D0BCFF]">
            <Layers className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
            <span>Navigation</span>
          </div>
        )}
        <button
          onClick={onToggleExpand}
          className={`p-2 rounded-full hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] transition-colors cursor-pointer ${
            !isExpanded ? 'mx-auto' : ''
          }`}
          title={isExpanded ? 'Collapse Navigation Drawer' : 'Expand Navigation Drawer'}
        >
          {isExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Drawer Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-5">
        {/* Core Locations Section */}
        <div className="space-y-1">
          {isExpanded && (
            <div className="px-4 text-[11px] font-semibold tracking-wider uppercase text-[#786C63] dark:text-[#CAC4D0] mb-2">
              Locations
            </div>
          )}

          {/* Root Directory */}
          <button
            onClick={() => onNavigate('/')}
            className={`w-full flex items-center ${
              isExpanded ? 'px-4 justify-start' : 'justify-center'
            } py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activePath === '/'
                ? 'bg-[#FCEEE6] text-[#9A3800] dark:bg-[#49454F] dark:text-[#EADDFF] font-semibold border border-[#E89E6C]/50 dark:border-transparent'
                : 'hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
            }`}
            title="Unified Root Directory"
          >
            <Folder className={`w-4 h-4 ${isExpanded ? 'mr-3 text-[#C85A17] dark:text-[#D0BCFF]' : 'text-[#C85A17] dark:text-[#D0BCFF]'} shrink-0`} />
            {isExpanded && <span>Unified Root</span>}
          </button>
        </div>

        {/* Favorites Section */}
        <div className="space-y-1">
          {isExpanded ? (
            <div className="flex items-center justify-between px-4 text-[11px] font-semibold tracking-wider uppercase text-[#786C63] dark:text-[#CAC4D0] mb-2">
              <span>Favorites</span>
              <button
                onClick={onAddFavoriteFolder}
                className="p-1 hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] rounded-full text-[#C85A17] dark:text-[#D0BCFF] cursor-pointer"
                title="Pin Current Path to Favorites"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-px bg-[#D8D2C9] dark:bg-[#49454F] my-2" />
          )}

          {favorites.map((fav) => {
            const isActive = activePath === fav.path;
            return (
              <div key={fav.id} className="group relative flex items-center">
                <button
                  onClick={() => onNavigate(fav.path)}
                  className={`w-full flex items-center ${
                    isExpanded ? 'px-4 justify-start' : 'justify-center'
                  } py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FCEEE6] text-[#9A3800] dark:bg-[#49454F] dark:text-[#EADDFF] font-semibold border border-[#E89E6C]/50 dark:border-transparent'
                      : 'hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
                  }`}
                  title={fav.path}
                >
                  {fav.isFolder ? (
                    <Folder className={`w-4 h-4 ${isExpanded ? 'mr-3 text-[#D97706] dark:text-amber-400' : 'text-[#D97706] dark:text-amber-400'} shrink-0`} />
                  ) : (
                    <FileText className={`w-4 h-4 ${isExpanded ? 'mr-3 text-[#C85A17] dark:text-[#D0BCFF]' : 'text-[#C85A17] dark:text-[#D0BCFF]'} shrink-0`} />
                  )}
                  {isExpanded && <span className="truncate pr-4">{fav.name}</span>}
                </button>

                {isExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(fav.id);
                    }}
                    className="absolute right-3 opacity-0 group-hover:opacity-100 p-1 text-[#786C63] dark:text-[#CAC4D0] hover:text-rose-500 rounded-full transition-opacity cursor-pointer"
                    title="Remove Favorite"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* WebDAV Endpoints List */}
        <div className="space-y-1">
          {isExpanded ? (
            <div className="flex items-center justify-between px-4 text-[11px] font-semibold tracking-wider uppercase text-[#786C63] dark:text-[#CAC4D0] mb-2">
              <span>Connected Endpoints ({endpoints.length})</span>
              <button
                onClick={onOpenEndpointsModal}
                className="p-1 hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] rounded-full text-[#C85A17] dark:text-[#D0BCFF] cursor-pointer"
                title="Manage & Add WebDAV Endpoints"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenEndpointsModal}
              className="w-full flex justify-center py-2 text-[#C85A17] dark:text-[#D0BCFF] hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] rounded-full cursor-pointer"
              title="WebDAV Endpoints"
            >
              <Server className="w-4 h-4" />
            </button>
          )}

          {isExpanded &&
            endpoints.map((ep) => (
              <div
                key={ep.id}
                className="flex items-center justify-between px-4 py-2 rounded-full hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] transition-colors text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: ep.color || '#4ADE80' }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[#2C221E] dark:text-[#E6E1E5] truncate leading-tight">
                      {ep.name}
                    </p>
                    <p className="text-[10px] text-[#786C63] dark:text-[#938F99] truncate">
                      {ep.isDemo ? 'Demo Endpoint' : ep.url}
                    </p>
                  </div>
                </div>

                {/* Enable / Disable Toggle Switch */}
                <input
                  type="checkbox"
                  checked={ep.enabled}
                  onChange={() => onToggleEndpoint(ep.id)}
                  className="w-4 h-4 rounded border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] text-[#C85A17] dark:text-[#D0BCFF] focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] cursor-pointer accent-[#C85A17] dark:accent-[#D0BCFF]"
                  title={ep.enabled ? 'Disable Endpoint in Unified View' : 'Enable Endpoint in Unified View'}
                />
              </div>
            ))}
        </div>

        {/* Sync & Duplicates Summary Card */}
        {isExpanded && duplicateCount > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#4a352c] border border-amber-500/30 dark:border-[#93000a] text-[#A1470A] dark:text-[#ffb4ab] space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-xs text-[#A1470A] dark:text-[#ffb4ab]">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Duplicate Synced Files</span>
            </div>
            <p className="text-[11px] opacity-90 leading-snug">
              {duplicateCount} files exist on multiple endpoints with matching paths.
            </p>
          </div>
        )}
      </div>

      {/* Storage Breakdown Footer */}
      {isExpanded && (
        <div className="p-4 border-t border-[#D8D2C9] dark:border-[#49454F] bg-[#F0EEEB] dark:bg-[#25232A] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#786C63] dark:text-[#CAC4D0]">
            <div className="flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#D0BCFF]" />
              <span>Unified Quota</span>
            </div>
            <span className="font-semibold text-[#2C221E] dark:text-[#E6E1E5]">
              {formatBytes(totalUsed)} / {formatBytes(totalQuota)}
            </span>
          </div>

          <div className="w-full bg-[#D8D2C9] dark:bg-[#49454F] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C85A17] dark:bg-[#D0BCFF] h-full transition-all duration-500 rounded-full"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Settings Action Button */}
      <div className="p-3 border-t border-[#D8D2C9] dark:border-[#49454F]">
        <button
          onClick={onOpenSettingsModal}
          className={`w-full flex items-center ${
            isExpanded ? 'px-4 justify-start' : 'justify-center'
          } py-2.5 rounded-full text-xs font-medium hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#2C221E] dark:text-[#E6E1E5] transition-colors cursor-pointer`}
          title="App Settings"
        >
          <Settings className={`w-4 h-4 ${isExpanded ? 'mr-3' : ''} text-[#786C63] dark:text-[#CAC4D0]`} />
          {isExpanded && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
