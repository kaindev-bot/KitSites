const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportZip: (files, defaultName) => ipcRenderer.invoke('export-zip', { files, defaultName })
});
