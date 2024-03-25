const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let isDev;

import('electron-is-dev').then((module) => {
  isDev = module.default;

  let win;
  
  function createWindow() {
    // 브라우저 창 생성
    win = new BrowserWindow({
      width: 1800,
      height: 900,
      webPreferences: {
        preload: path.join(__dirname, '../build/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      resizable: false,
      frame: false
    });

    win.setMenu(null);

    ipcMain.on('minimize-event', () => {
      win.minimize();
    });
  
    // 닫기 이벤트
    ipcMain.on('close-event', () => {
      win.close();
    });

    ipcMain.on('open-link-external', (event, url) => {
      shell.openExternal(url);
    });

    ipcMain.on('apply-update', () => {
        autoUpdater.quitAndInstall();
    });
  
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

  app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update-available');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `다운로드 속도: ${progressObj.bytesPerSecond}`;
    message += ` - 진행 상태: ${progressObj.percent}%`;
    message += ` (${progressObj.transferred}/${progressObj.total})`;
  });
  
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
  });
});