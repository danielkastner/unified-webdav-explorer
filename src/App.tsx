import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  WebDavEndpoint,
  WebDavFile,
  TabItem,
  FavoriteItem,
  AppSettings,
} from './types';
import {
  loadEndpointsFromStorage,
  saveEndpointsToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
  fetchEndpointsData,
  fetchFolderData,
  fetchTmdbMetadata,
  unifyEndpointFiles,
  getParentPath,
  INITIAL_ENDPOINTS,
} from './lib/webdavEngine';

import { DesktopTitleBar } from './components/DesktopTitleBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { TabBar } from './components/TabBar';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { FilterBar } from './components/FilterBar';
import { FileTableView } from './components/FileTableView';
import { FileGridView } from './components/FileGridView';
import { FileCardsView } from './components/FileCardsView';

import { EndpointManagerModal } from './components/EndpointManagerModal';
import { DuplicateInspectorModal } from './components/DuplicateInspectorModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { SettingsModal } from './components/SettingsModal';
import { NewFolderModal } from './components/NewFolderModal';
import { FileUploadModal } from './components/FileUploadModal';
import { ElectronGuideModal } from './components/ElectronGuideModal';

export default function App() {
  // 1. Persistent Data & Settings
  const [endpoints, setEndpoints] = useState<WebDavEndpoint[]>(loadEndpointsFromStorage);
  const [settings, setSettings] = useState<AppSettings>(loadSettingsFromStorage);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavoritesFromStorage);
  const [rawFiles, setRawFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Navigation & Tabs State
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-1',
      title: 'Unified Root',
      path: '/',
      filter: 'all',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
      viewMode: settings.defaultViewMode || 'table',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());

  // 3. Modals State
  const [isEndpointsModalOpen, setIsEndpointsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isElectronGuideOpen, setIsElectronGuideOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<WebDavFile | null>(null);
  const [duplicateInspectFile, setDuplicateInspectFile] = useState<WebDavFile | null>(null);

  // Active Tab reference
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  // Handle Theme Application (Light / Dark)
  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeMode === 'dark') {
      root.classList.add('dark');
    } else if (settings.themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.themeMode]);

  // Load files from backend API or demo generator
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { files, statuses } = await fetchEndpointsData(endpoints);
    setRawFiles(files);

    if (statuses && Object.keys(statuses).length > 0) {
      setEndpoints((prev) => {
        let hasChanged = false;
        const next = prev.map((ep) => {
          const info = statuses[ep.id];
          if (info && ep.status !== info.status) {
            hasChanged = true;
            return {
              ...ep,
              status: info.status as 'connected' | 'error' | 'syncing' | 'offline',
              lastSynced: new Date().toISOString(),
            };
          }
          return ep;
        });
        return hasChanged ? next : prev;
      });
    }

    setIsLoading(false);
  }, [endpoints]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Dynamically fetch folder contents when navigating into a subfolder
  const loadFolder = useCallback(async (folderPath: string) => {
    if (!folderPath || folderPath === '/') return;
    const newFiles = await fetchFolderData(endpoints, folderPath);
    if (newFiles.length > 0) {
      setRawFiles((prev) => {
        const existingKeys = new Set(
          prev.map((f) => `${f.path}_${Array.isArray(f.endpoints) ? f.endpoints.slice().sort().join(',') : ''}`)
        );
        const toAdd = newFiles.filter(
          (nf) => !existingKeys.has(`${nf.path}_${Array.isArray(nf.endpoints) ? nf.endpoints.slice().sort().join(',') : ''}`)
        );
        if (toAdd.length === 0) return prev;
        return [...prev, ...toAdd];
      });
    }
  }, [endpoints]);

  useEffect(() => {
    if (activeTab?.path && activeTab.path !== '/') {
      loadFolder(activeTab.path);
    }
  }, [activeTab?.path, loadFolder]);

  // Auto-fetch TMDB metadata for movie files in the currently listed directory lacking metadata, saving as JSON sidecar
  useEffect(() => {
    if (!rawFiles || rawFiles.length === 0) return;

    const currentDirPath = activeTab?.path || '/';

    const moviesNeedingTmdb = rawFiles.filter((rf) => {
      if (rf.isDirectory || rf.tmdbData) return false;

      // Only fetch for files located directly inside the currently listed directory
      const parentPath = getParentPath(rf.path);
      if (parentPath !== currentDirPath) return false;

      const ext = (rf.name || '').split('.').pop()?.toLowerCase() || '';
      const isVideoExt = ['mp4', 'mkv', 'webm', 'avi', 'mov', 'wmv'].includes(ext);
      const isVideoMime = (rf.mimeType || '').startsWith('video/');
      const isMoviesFolder = (rf.path || '').toLowerCase().includes('/movies/');
      return isVideoExt || isVideoMime || isMoviesFolder;
    });

    if (moviesNeedingTmdb.length === 0) return;

    let isMounted = true;
    moviesNeedingTmdb.forEach(async (movie) => {
      const tmdbRes = await fetchTmdbMetadata(movie.path, movie.name);
      if (isMounted && tmdbRes?.data) {
        setRawFiles((prev) => {
          let changed = false;
          const next = prev.map((f) => {
            if (f.path === movie.path) {
              changed = true;
              return {
                ...f,
                tmdbData: tmdbRes.data,
                tmdbJsonPath: tmdbRes.jsonFilePath,
              };
            }
            return f;
          });

          // Ensure sidecar .json file exists in rawFiles
          const sidecarExists = next.some((f) => f.path === tmdbRes.jsonFilePath);
          if (!sidecarExists && tmdbRes.jsonFilePath) {
            changed = true;
            next.push({
              path: tmdbRes.jsonFilePath,
              name: tmdbRes.jsonFileName,
              isDirectory: false,
              size: JSON.stringify(tmdbRes.data, null, 2).length,
              mimeType: 'application/json',
              lastModified: tmdbRes.data.cachedAt || new Date().toISOString(),
              endpoints: Array.isArray(movie.endpoints) ? movie.endpoints : ['ep-1'],
            });
          }

          return changed ? next : prev;
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [rawFiles, activeTab?.path]);

  // Save changes to localStorage
  useEffect(() => {
    saveEndpointsToStorage(endpoints);
  }, [endpoints]);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  useEffect(() => {
    saveFavoritesToStorage(favorites);
  }, [favorites]);

  // Compute Unified Merged Files Tree
  const unifiedFiles = useMemo(() => {
    return unifyEndpointFiles(rawFiles, endpoints, settings);
  }, [rawFiles, endpoints, settings]);

  // Count overall duplicates for metrics
  const duplicateCount = useMemo(() => {
    return unifiedFiles.filter((f) => f.isDuplicate).length;
  }, [unifiedFiles]);

  // Filter & Sort Files for Current Active Tab
  const activeDirectoryFiles = useMemo(() => {
    if (!activeTab) return [];

    return unifiedFiles.filter((file) => {
      // Search filter
      if (activeTab.searchQuery.trim()) {
        const q = activeTab.searchQuery.toLowerCase();
        const matchesName = file.name.toLowerCase().includes(q);
        const matchesPath = file.path.toLowerCase().includes(q);
        const matchesEp = file.endpoints.some((e) => e.endpointName.toLowerCase().includes(q));
        if (!matchesName && !matchesPath && !matchesEp) return false;
      } else {
        // Path filter (Direct children of active directory path)
        if (file.parentPath !== activeTab.path && file.path !== activeTab.path) {
          return false;
        }
        if (file.path === activeTab.path) return false;
      }

      // Duplicates filter chip
      if (duplicatesOnly && !file.isDuplicate) return false;

      // Type filter chip
      if (activeTab.filter !== 'all') {
        if (file.isDirectory) return true; // Keep folders visible
        if (file.fileType !== activeTab.filter) return false;
      }

      return true;
    }).sort((a, b) => {
      // Folders always sorted top first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;

      let valA: any = a.name.toLowerCase();
      let valB: any = b.name.toLowerCase();

      if (activeTab.sortBy === 'size') {
        valA = a.size;
        valB = b.size;
      } else if (activeTab.sortBy === 'modified') {
        valA = new Date(a.lastModified).getTime();
        valB = new Date(b.lastModified).getTime();
      } else if (activeTab.sortBy === 'endpoints') {
        valA = a.endpoints.length;
        valB = b.endpoints.length;
      } else if (activeTab.sortBy === 'type') {
        valA = a.fileType;
        valB = b.fileType;
      }

      if (valA < valB) return activeTab.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return activeTab.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [unifiedFiles, activeTab, duplicatesOnly]);

  // Tab Handlers
  const updateActiveTab = (updates: Partial<TabItem>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t))
    );
  };

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    setSelectedFileIds(new Set());
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  const handleAddTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: TabItem = {
      id: newId,
      title: 'Unified Root',
      path: '/',
      filter: 'all',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
      viewMode: settings.defaultViewMode || 'table',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const handleNavigatePath = (newPath: string) => {
    updateActiveTab({ path: newPath, searchQuery: '' });
    setSelectedFileIds(new Set());
  };

  // Selection handlers
  const handleToggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedFileIds.size === activeDirectoryFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(activeDirectoryFiles.map((f) => f.id)));
    }
  };

  // Endpoint Management Handlers
  const handleAddEndpoint = (newEp: Omit<WebDavEndpoint, 'id'>) => {
    const id = `ep-${Date.now()}`;
    setEndpoints([...endpoints, { ...newEp, id }]);
  };

  const handleUpdateEndpoint = (id: string, updates: Partial<WebDavEndpoint>) => {
    setEndpoints((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleDeleteEndpoint = (id: string) => {
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  };

  const handleTestEndpoint = async (ep: WebDavEndpoint) => {
    try {
      const res = await fetch('/api/webdav/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ep),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  // Favorites Handlers
  const handleToggleStarFile = (id: string) => {
    const target = unifiedFiles.find((f) => f.id === id);
    if (!target) return;

    if (favorites.some((fav) => fav.path === target.path)) {
      setFavorites(favorites.filter((fav) => fav.path !== target.path));
    } else {
      setFavorites([
        ...favorites,
        {
          id: `fav-${Date.now()}`,
          name: target.name,
          path: target.path,
          isFolder: target.isDirectory,
        },
      ]);
    }
  };

  const handleAddCurrentPathToFavorites = () => {
    const pathName = activeTab.path === '/' ? 'Root' : activeTab.path.split('/').pop() || activeTab.path;
    if (!favorites.some((fav) => fav.path === activeTab.path)) {
      setFavorites([
        ...favorites,
        {
          id: `fav-${Date.now()}`,
          name: pathName,
          path: activeTab.path,
          isFolder: true,
        },
      ]);
    }
  };

  // File Creation & Upload Handlers
  const handleCreateFolder = (folderName: string) => {
    const cleanParent = activeTab.path === '/' ? '' : activeTab.path;
    const newPath = `${cleanParent}/${folderName}`;

    // Add new folder to rawFiles for active enabled endpoints
    const activeEpIds = endpoints.filter((e) => e.enabled).map((e) => e.id);
    const newFolderRaw = {
      path: newPath,
      name: folderName,
      isDirectory: true,
      size: 0,
      mimeType: 'folder',
      lastModified: new Date().toISOString(),
      endpoints: activeEpIds,
    };

    setRawFiles([newFolderRaw, ...rawFiles]);
  };

  const handleUploadFiles = (fileList: FileList, targetEndpointIds: string[]) => {
    const cleanParent = activeTab.path === '/' ? '' : activeTab.path;
    const newRawItems: any[] = [];

    Array.from(fileList).forEach((file) => {
      const newPath = `${cleanParent}/${file.name}`;
      newRawItems.push({
        path: newPath,
        name: file.name,
        isDirectory: false,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        lastModified: new Date().toISOString(),
        endpoints: targetEndpointIds,
      });
    });

    setRawFiles([...newRawItems, ...rawFiles]);
  };

  const handleDeleteFile = (file: WebDavFile) => {
    setRawFiles((prev) => prev.filter((r) => r.path !== file.path));
    if (previewFile?.id === file.id) setPreviewFile(null);
  };

  const handleDownloadFile = (file: WebDavFile) => {
    window.open(`/api/webdav/preview?path=${encodeURIComponent(file.path)}`, '_blank');
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('unified_webdav_endpoints_v1');
    localStorage.removeItem('unified_webdav_settings_v1');
    localStorage.removeItem('unified_webdav_favorites_v1');
    setEndpoints(INITIAL_ENDPOINTS);
    loadData();
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* 1. Desktop Titlebar */}
      <DesktopTitleBar
        endpoints={endpoints}
        settings={settings}
        onUpdateSettings={(up) => setSettings({ ...settings, ...up })}
        onOpenEndpointsModal={() => setIsEndpointsModalOpen(true)}
        onOpenElectronGuide={() => setIsElectronGuideOpen(true)}
        activeTabCount={tabs.length}
      />

      {/* 2. Main Work Area: Navigation Drawer + Center Explorer Panel */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Navigation Drawer */}
        <NavigationDrawer
          isExpanded={isDrawerExpanded}
          onToggleExpand={() => setIsDrawerExpanded(!isDrawerExpanded)}
          endpoints={endpoints}
          favorites={favorites}
          activePath={activeTab.path}
          onNavigate={handleNavigatePath}
          onOpenEndpointsModal={() => setIsEndpointsModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onToggleEndpoint={(id) => handleUpdateEndpoint(id, { enabled: !endpoints.find((e) => e.id === id)?.enabled })}
          onRemoveFavorite={(id) => setFavorites(favorites.filter((f) => f.id !== id))}
          onAddFavoriteFolder={handleAddCurrentPathToFavorites}
          duplicateCount={duplicateCount}
        />

        {/* Center Main View: Multi-Tab Header, Breadcrumb, FilterBar, File Grid */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 overflow-hidden">
          {/* Multi-Tab Navigation Bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onAddTab={handleAddTab}
          />

          {/* Directory Breadcrumb & Actions */}
          <BreadcrumbNav
            currentPath={activeTab.path}
            onNavigate={handleNavigatePath}
            onRefresh={loadData}
            onOpenNewFolder={() => setIsNewFolderModalOpen(true)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />

          {/* Material Design 3 Filter Chips & View Mode Controls */}
          <FilterBar
            currentFilter={activeTab.filter}
            onSelectFilter={(f) => updateActiveTab({ filter: f })}
            searchQuery={activeTab.searchQuery}
            onSearchChange={(q) => updateActiveTab({ searchQuery: q })}
            duplicatesOnly={duplicatesOnly}
            onToggleDuplicatesOnly={() => setDuplicatesOnly(!duplicatesOnly)}
            sortBy={activeTab.sortBy}
            sortOrder={activeTab.sortOrder}
            onChangeSort={(s) => updateActiveTab({ sortBy: s })}
            onToggleSortOrder={() => updateActiveTab({ sortOrder: activeTab.sortOrder === 'asc' ? 'desc' : 'asc' })}
            viewMode={activeTab.viewMode}
            onChangeViewMode={(v) => updateActiveTab({ viewMode: v })}
            selectedCount={selectedFileIds.size}
            onClearSelection={() => setSelectedFileIds(new Set())}
            onBatchStar={() => {
              selectedFileIds.forEach((id) => handleToggleStarFile(id));
              setSelectedFileIds(new Set());
            }}
            onBatchDownload={() => {
              selectedFileIds.forEach((id) => {
                const f = unifiedFiles.find((file) => file.id === id);
                if (f) handleDownloadFile(f);
              });
            }}
            onBatchDelete={() => {
              selectedFileIds.forEach((id) => {
                const f = unifiedFiles.find((file) => file.id === id);
                if (f) handleDeleteFile(f);
              });
              setSelectedFileIds(new Set());
            }}
            totalMatchingFiles={activeDirectoryFiles.length}
          />

          {/* File Grid / Table Main Content Stage */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-0 scroll-smooth">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Unifying WebDAV Directory Structures...</p>
              </div>
            ) : activeTab.viewMode === 'table' ? (
              <FileTableView
                files={activeDirectoryFiles}
                selectedIds={selectedFileIds}
                onToggleSelect={handleToggleSelectFile}
                onToggleSelectAll={handleToggleSelectAll}
                onNavigateFolder={handleNavigatePath}
                onOpenFilePreview={(file) => setPreviewFile(file)}
                onOpenDuplicateInspector={(file) => setDuplicateInspectFile(file)}
                onToggleStarFile={handleToggleStarFile}
                onDeleteFile={handleDeleteFile}
                sortBy={activeTab.sortBy}
                sortOrder={activeTab.sortOrder}
                onHeaderSort={(key) => {
                  if (activeTab.sortBy === key) {
                    updateActiveTab({ sortOrder: activeTab.sortOrder === 'asc' ? 'desc' : 'asc' });
                  } else {
                    updateActiveTab({ sortBy: key, sortOrder: 'asc' });
                  }
                }}
              />
            ) : activeTab.viewMode === 'grid' ? (
              <FileGridView
                files={activeDirectoryFiles}
                selectedIds={selectedFileIds}
                onToggleSelect={handleToggleSelectFile}
                onNavigateFolder={handleNavigatePath}
                onOpenFilePreview={(file) => setPreviewFile(file)}
                onOpenDuplicateInspector={(file) => setDuplicateInspectFile(file)}
                onToggleStarFile={handleToggleStarFile}
                onDeleteFile={handleDeleteFile}
              />
            ) : (
              <FileCardsView
                files={activeDirectoryFiles}
                selectedIds={selectedFileIds}
                onToggleSelect={handleToggleSelectFile}
                onNavigateFolder={handleNavigatePath}
                onOpenFilePreview={(file) => setPreviewFile(file)}
                onOpenDuplicateInspector={(file) => setDuplicateInspectFile(file)}
                onToggleStarFile={handleToggleStarFile}
                onDeleteFile={handleDeleteFile}
              />
            )}
          </div>
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <EndpointManagerModal
        isOpen={isEndpointsModalOpen}
        onClose={() => setIsEndpointsModalOpen(false)}
        endpoints={endpoints}
        onAddEndpoint={handleAddEndpoint}
        onUpdateEndpoint={handleUpdateEndpoint}
        onDeleteEndpoint={handleDeleteEndpoint}
        onTestEndpoint={handleTestEndpoint}
      />

      <DuplicateInspectorModal
        file={duplicateInspectFile}
        onClose={() => setDuplicateInspectFile(null)}
        onDownloadFromEndpoint={(epId) => {
          if (duplicateInspectFile) handleDownloadFile(duplicateInspectFile);
        }}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownloadFile}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(up) => setSettings(up)}
        onResetDemoData={handleResetDemoData}
      />

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        currentPath={activeTab.path}
        onCreateFolder={handleCreateFolder}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentPath={activeTab.path}
        endpoints={endpoints}
        onUploadFiles={handleUploadFiles}
      />

      <ElectronGuideModal
        isOpen={isElectronGuideOpen}
        onClose={() => setIsElectronGuideOpen(false)}
      />
    </div>
  );
}
