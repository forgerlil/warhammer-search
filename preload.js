const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scrape', {
  search: (query) => ipcRenderer.invoke('search', query),
});
