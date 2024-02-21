const { app, BrowserWindow } = require('electron');

function createWindow () {
  // 브라우저 창을 생성
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 리액트 앱을 로드
  win.loadURL('http://localhost:3000/');
}

app.whenReady().then(createWindow);