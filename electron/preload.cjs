const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  
  // Window Control
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  isMaximized: () => ipcRenderer.invoke('is-maximized'),
  
  // Native File System & OS Features
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  showInFolder: (filePath) => ipcRenderer.invoke('show-in-folder', filePath),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getElectronInfo: () => ipcRenderer.invoke('get-electron-info'),
});
