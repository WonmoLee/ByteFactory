const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let isDev;

import('electron-is-dev').then((module) => {
  isDev = module.default;
  
  function createWindow() {
    // 브라우저 창 생성
    let win = new BrowserWindow({
      width: 1800,
      height: 900,
      webPreferences: {
        preload: path.join(__dirname, '../build/preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true
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
    dialog.showMessageBox({
      type: 'info',
      title: '업데이트 가능',
      message: '새로운 버전이 사용 가능합니다. 다운로드를 시작할까요?',
      buttons: ['업데이트', '나중에']
    }).then(result => {
      if (result.response === 0) { // '업데이트' 버튼
        autoUpdater.downloadUpdate();
      }
    });
  });
  
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '업데이트 설치',
      message: '업데이트가 다운로드 되었습니다. 애플리케이션을 재시작하여 업데이트를 적용할까요?',
      buttons: ['재시작', '나중에']
    }).then(result => {
      if (result.response === 0) { // '재시작' 버튼
        autoUpdater.quitAndInstall();
      }
    });
  });
});