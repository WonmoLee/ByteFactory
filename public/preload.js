const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  windowControls: {
    minimize: () => ipcRenderer.send('minimize-event'),
    close: () => ipcRenderer.send('close-event'),
  },
  send: (channel, data) => {
    // 화이트리스트에 있는 채널에서만 메시지를 보내도록 합니다.
    let validChannels = ["open-link-external", "update-downloaded", "apply-update"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});