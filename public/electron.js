const { app, BrowserWindow } = require('electron');
const path = require('path');

let isDev;

import('electron-is-dev').then((module) => {
  isDev = module.default;
  
  function createWindow() {
    // 브라우저 창 생성
    let win = new BrowserWindow({
      width: 1600,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    win.setMenu(null);
  
    // 개발 환경인지 프로덕션 환경인지에 따라 URL 분기
    if (isDev) {
      // 개발 환경: React 개발 서버 URL
      win.loadURL('http://localhost:3000');
      // 개발자 도구 열기
      win.webContents.openDevTools();
    } else {
      // 프로덕션 환경: 빌드된 React 앱 로드
      win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }
  
    // 창이 닫힐 때 발생하는 이벤트
    win.on('closed', () => {
      win = null;
    });
  }
  
  // 앱이 준비되면 창 생성
  app.whenReady().then(createWindow);
  
  // 모든 창이 닫혔을 때 앱 종료
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});