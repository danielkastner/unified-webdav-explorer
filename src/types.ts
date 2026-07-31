export type AuthType = 'basic' | 'bearer' | 'none';

export type EndpointStatus = 'connected' | 'syncing' | 'error' | 'untested';

export interface WebDavEndpoint {
  id: string;
  name: string;
  url: string;
  username?: string;
  password?: string;
  authType: AuthType;
  color: string; // Hex or Tailwind color
  enabled: boolean;
  status: EndpointStatus;
  lastSynced?: string;
  storageUsed?: number; // bytes
  storageTotal?: number; // bytes
  isDemo?: boolean;
  errorMessage?: string;
}

export interface EndpointFileInfo {
  endpointId: string;
  endpointName: string;
  endpointColor: string;
  endpointUrl?: string;
  realPath: string;
  size: number;
  lastModified: string;
  etag?: string;
}

export interface MediaInfo {
  title?: string;
  year?: number | string;
  rating?: string;
  extra?: string;
}

export interface TMDBMovieData {
  id?: number;
  title: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  poster_url?: string;
  backdrop_path?: string;
  backdrop_url?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: string[];
  runtime?: number;
  tagline?: string;
  cachedAt?: string;
  jsonFileName?: string;
  jsonFilePath?: string;
  source?: 'tmdb_api' | 'json_cache' | 'fallback_database';
}

export interface WebDavFile {
  id: string; // Computed unique ID or composite path
  name: string;
  path: string; // Relative path, e.g. "/Documents/Report.pdf"
  parentPath: string; // e.g. "/Documents"
  isDirectory: boolean;
  size: number;
  fileType: 'document' | 'image' | 'video' | 'audio' | 'code' | 'archive' | 'folder' | 'other';
  mimeType?: string;
  lastModified: string;
  endpoints: EndpointFileInfo[];
  isDuplicate: boolean; // true if file exists on 2+ endpoints
  isSynced: boolean;    // true if file metadata matches across endpoints
  isStarred?: boolean;
  extension?: string;
  mediaInfo?: MediaInfo;
  tmdbData?: TMDBMovieData;
  tmdbJsonPath?: string;
}

export interface TabItem {
  id: string;
  title: string;
  path: string;
  filter: 'all' | 'document' | 'image' | 'video' | 'audio' | 'code' | 'archive';
  searchQuery: string;
  sortBy: 'name' | 'size' | 'modified' | 'endpoints' | 'type';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'table' | 'cards';
}

export interface FavoriteItem {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  icon?: string;
}

export interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  duplicateDetectionMode: 'exact_path' | 'filename_only';
  autoRefreshInterval: number; // seconds, 0 = manual
  defaultViewMode: 'grid' | 'table' | 'cards';
  showHiddenFiles: boolean;
  mockServerEnabled: boolean;
  compactMode: boolean;
  downloadCommand?: string;
}

export interface SyncConflictInfo {
  file: WebDavFile;
  diffs: {
    endpointId: string;
    endpointName: string;
    endpointColor: string;
    size: number;
    lastModified: string;
    etag?: string;
  }[];
}

export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  selectDirectory: () => Promise<string | null>;
  showInFolder: (filePath: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  executeBashCommand: (command: string, action?: string) => Promise<{
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
    command?: string;
  }>;
  getElectronInfo: () => Promise<{
    isElectron: boolean;
    platform: string;
    version: string;
    electronVersion: string;
    chromeVersion: string;
  }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

