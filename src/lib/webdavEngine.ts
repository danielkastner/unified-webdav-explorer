import { WebDavEndpoint, WebDavFile, EndpointFileInfo, AppSettings, MediaInfo } from '../types';

const ENDPOINTS_STORAGE_KEY = 'unified_webdav_endpoints_v1';
const SETTINGS_STORAGE_KEY = 'unified_webdav_settings_v1';
const FAVORITES_STORAGE_KEY = 'unified_webdav_favorites_v1';
const CUSTOM_FILES_STORAGE_KEY = 'unified_webdav_custom_files_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  duplicateDetectionMode: 'exact_path',
  autoRefreshInterval: 0,
  defaultViewMode: 'table',
  showHiddenFiles: false,
  mockServerEnabled: true,
  compactMode: false,
};

// Initial Demo Endpoints
export const INITIAL_ENDPOINTS: WebDavEndpoint[] = [
  {
    id: 'ep-1',
    name: 'Cloud Drive Alpha (Nextcloud)',
    url: 'https://alpha-cloud.dav.internal/files/',
    username: 'alex_dev',
    authType: 'basic',
    color: '#3b82f6', // Blue
    enabled: true,
    status: 'connected',
    lastSynced: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    storageUsed: 4250000000,
    storageTotal: 20000000000,
    isDemo: true,
  },
  {
    id: 'ep-2',
    name: 'Home NAS Beta (Synology)',
    url: 'https://nas-beta.home.arpa/webdav/',
    username: 'admin',
    authType: 'basic',
    color: '#10b981', // Emerald
    enabled: true,
    status: 'connected',
    lastSynced: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    storageUsed: 12800000000,
    storageTotal: 50000000000,
    isDemo: true,
  },
  {
    id: 'ep-3',
    name: 'Project Vault Gamma (ownCloud)',
    url: 'https://vault.company-dev.org/dav/',
    username: 'project_lead',
    authType: 'bearer',
    color: '#8b5cf6', // Purple
    enabled: true,
    status: 'connected',
    lastSynced: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    storageUsed: 890000000,
    storageTotal: 10000000000,
    isDemo: true,
  },
];

export const INITIAL_FAVORITES = [
  { id: 'fav-1', name: 'Documents', path: '/Documents', isFolder: true, icon: 'folder' },
  { id: 'fav-2', name: 'Photos', path: '/Photos', isFolder: true, icon: 'folder' },
  { id: 'fav-3', name: 'Projects', path: '/Projects', isFolder: true, icon: 'folder' },
  { id: 'fav-4', name: 'Q3 Financial Report', path: '/Documents/Q3_Financial_Report.pdf', isFolder: false, icon: 'file' },
];

export function getFileTypeFromName(filename: string, isDirectory: boolean): WebDavFile['fileType'] {
  if (isDirectory) return 'folder';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'pages', 'md'].includes(ext)) return 'document';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'avif'].includes(ext)) return 'image';
  if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) return 'audio';
  if (['js', 'ts', 'jsx', 'tsx', 'json', 'py', 'sh', 'css', 'html', 'sql', 'xml'].includes(ext)) return 'code';
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) return 'archive';
  return 'other';
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

// Storage Helpers
export function loadEndpointsFromStorage(): WebDavEndpoint[] {
  try {
    const stored = localStorage.getItem(ENDPOINTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load endpoints from storage', e);
  }
  return INITIAL_ENDPOINTS;
}

export function saveEndpointsToStorage(endpoints: WebDavEndpoint[]): void {
  try {
    localStorage.setItem(ENDPOINTS_STORAGE_KEY, JSON.stringify(endpoints));
  } catch (e) {
    console.error('Failed to save endpoints', e);
  }
}

export function loadSettingsFromStorage(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadFavoritesFromStorage() {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load favorites', e);
  }
  return INITIAL_FAVORITES;
}

export function saveFavoritesToStorage(favorites: any[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

// Fetch raw files from API or demo mock
export async function fetchEndpointsData(endpoints: WebDavEndpoint[]): Promise<{ files: any[]; statuses?: Record<string, { status: string; message: string; count: number }> }> {
  try {
    const res = await fetch('/api/webdav/fetch-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoints }),
    });
    if (res.ok) {
      const data = await res.json();
      return { files: data.files || [], statuses: data.statuses };
    }
  } catch (err) {
    console.warn('Falling back to local demo files generator', err);
  }
  return { files: [], statuses: {} };
}

// Fetch single folder contents on demand
export async function fetchFolderData(endpoints: WebDavEndpoint[], folderPath: string): Promise<any[]> {
  try {
    const res = await fetch('/api/webdav/fetch-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoints, folderPath }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.files || [];
    }
  } catch (err) {
    console.warn('Error fetching folder data', err);
  }
  return [];
}

// Fetch or load TMDB movie metadata sidecar JSON
export async function fetchTmdbMetadata(filePath: string, filename: string, forceRefresh = false) {
  try {
    const res = await fetch('/api/tmdb/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, filename, forceRefresh }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return {
          data: data.data,
          fromJsonCache: Boolean(data.fromJsonCache),
          jsonFileName: data.jsonFileName as string,
          jsonFilePath: data.jsonFilePath as string,
        };
      }
    }
  } catch (err) {
    console.warn('[TMDB Client Error]', err);
  }
  return null;
}

// Unification Engine: Merges multiple endpoint files into a single unified virtual directory structure
export function unifyEndpointFiles(
  rawFiles: any[],
  endpoints: WebDavEndpoint[],
  settings: AppSettings
): WebDavFile[] {
  const activeEndpointMap = new Map<string, WebDavEndpoint>();
  endpoints.filter((ep) => ep.enabled).forEach((ep) => activeEndpointMap.set(ep.id, ep));

  // Map to collect items by path key (e.g., "/Documents/Report.pdf")
  const unifiedMap = new Map<string, WebDavFile>();

  rawFiles.forEach((raw) => {
    const rawEpList: string[] = Array.isArray(raw.endpoints)
      ? raw.endpoints
      : raw.endpointId
      ? [raw.endpointId]
      : Array.from(activeEndpointMap.keys());

    const activeEpIds = rawEpList.filter((epId: string) => activeEndpointMap.has(epId));
    if (activeEpIds.length === 0) return; // Skip if no enabled endpoints host this file

    const pathKey = settings.duplicateDetectionMode === 'filename_only' && !raw.isDirectory
      ? raw.name.toLowerCase()
      : raw.path.toLowerCase();

    const parentPath = getParentPath(raw.path);
    const ext = raw.name.includes('.') ? raw.name.split('.').pop()?.toLowerCase() : undefined;

    const endpointInfos: EndpointFileInfo[] = activeEpIds.map((epId: string) => {
      const ep = activeEndpointMap.get(epId)!;
      return {
        endpointId: ep.id,
        endpointName: ep.name,
        endpointColor: ep.color,
        realPath: raw.path,
        size: raw.size,
        lastModified: raw.lastModified,
        etag: `etag-${ep.id}-${raw.name}`,
      };
    });

    if (unifiedMap.has(pathKey)) {
      // Merge with existing entry
      const existing = unifiedMap.get(pathKey)!;
      // Combine endpoints
      endpointInfos.forEach((epInfo) => {
        if (!existing.endpoints.some((e) => e.endpointId === epInfo.endpointId)) {
          existing.endpoints.push(epInfo);
        }
      });
      existing.isDuplicate = existing.endpoints.length > 1;
      
      // Check sync state (sizes match)
      const sizes = existing.endpoints.map((e) => e.size);
      const allSizesEqual = sizes.every((s) => s === sizes[0]);
      existing.isSynced = allSizesEqual;

      // Keep max size or latest modification
      if (raw.size > existing.size) existing.size = raw.size;
      if (raw.mediaInfo && !existing.mediaInfo) existing.mediaInfo = raw.mediaInfo;
      if (raw.tmdbData && !existing.tmdbData) existing.tmdbData = raw.tmdbData;
      if (raw.tmdbJsonPath && !existing.tmdbJsonPath) existing.tmdbJsonPath = raw.tmdbJsonPath;
    } else {
      // Create new unified entry
      const fileType = getFileTypeFromName(raw.name, raw.isDirectory);
      const unifiedFile: WebDavFile = {
        id: `unified-${pathKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: raw.name,
        path: raw.path,
        parentPath,
        isDirectory: raw.isDirectory,
        size: raw.size,
        fileType,
        mimeType: raw.mimeType,
        lastModified: raw.lastModified,
        endpoints: endpointInfos,
        isDuplicate: endpointInfos.length > 1,
        isSynced: true,
        extension: ext,
        mediaInfo: raw.mediaInfo || parseMediaInfoFromFileName(raw.name, raw.path),
        tmdbData: raw.tmdbData,
        tmdbJsonPath: raw.tmdbJsonPath,
      };
      unifiedMap.set(pathKey, unifiedFile);
    }
  });

  return Array.from(unifiedMap.values());
}

export function parseMediaInfoFromFileName(name: string, path: string): MediaInfo | undefined {
  if (!name || name.startsWith('.')) return undefined;

  // Look for year e.g. 19xx or 20xx
  const yearMatch = name.match(/[\s._(](19\d\d|20\d\d)[\s._)]/);
  // Look for rating e.g. 8.8, 7.5, 9.0
  const ratingMatch = name.match(/[\s._\[]([0-9]\.[0-9])[\s._\]]/) || name.match(/([0-9]\.[0-9])\s*\/\s*10/);

  if (yearMatch) {
    const year = yearMatch[1];
    const yearIndex = name.indexOf(yearMatch[0]);
    let rawTitle = name.substring(0, yearIndex).replace(/[._]/g, ' ').trim();
    if (rawTitle.startsWith('(') && rawTitle.endsWith(')')) rawTitle = rawTitle.slice(1, -1);

    if (rawTitle.length > 0) {
      return {
        title: rawTitle,
        year: year,
        rating: ratingMatch ? `${ratingMatch[1]}/10` : undefined,
      };
    }
  }

  return undefined;
}

export function formatMediaInfo(file: WebDavFile): string {
  const info = file.mediaInfo || parseMediaInfoFromFileName(file.name, file.path);
  if (!info) return '';

  const parts: string[] = [];

  if (info.title) {
    if (info.year) {
      parts.push(`${info.title} (${info.year})`);
    } else {
      parts.push(info.title);
    }
  } else if (info.year) {
    parts.push(`Year: ${info.year}`);
  }

  if (info.rating) {
    parts.push(`Rating: ${info.rating}`);
  }

  if (info.extra) {
    parts.push(info.extra);
  }

  return parts.join(' • ');
}

export function getParentPath(path: string): string {
  if (!path || path === '/') return '/';
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash === 0) return '/';
  return path.substring(0, lastSlash);
}

export function isMovieFile(file: WebDavFile | null | undefined): boolean {
  if (!file || file.isDirectory) return false;
  if (file.fileType === 'video') return true;
  if (file.mimeType?.startsWith('video/')) return true;

  const ext = file.extension?.toLowerCase() || file.name.split('.').pop()?.toLowerCase() || '';
  const movieExtensions = ['mp4', 'mkv', 'webm', 'avi', 'mov', 'wmv', 'flv', 'm4v', '3gp', 'ts', 'vob', 'ogv'];
  if (movieExtensions.includes(ext)) return true;

  if (file.path.toLowerCase().includes('/movies/')) return true;

  return false;
}
