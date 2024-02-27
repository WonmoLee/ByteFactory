const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  windowControls: {
    minimize: () => ipcRenderer.send('minimize-event'),
    close: () => ipcRenderer.send('close-event'),
  },
});
