const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let isDev;
let updateApproved = false;

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
      win.webContents.openDevTools();
    }
  
    // 창이 닫힐 때 발생하는 이벤트
    win.on('closed', () => {
      win = null;
    });
  }
  
  // 앱이 준비되면 창 생성
  app.whenReady().then(createWindow);
  
  app.on('before-quit', (event) => {
    if (!updateApproved) {
        // 사용자가 업데이트를 승인하지 않았다면 종료 과정을 중단
        event.preventDefault();
        // 필요한 경우 사용자에게 알림을 표시하거나 추가 로직을 실행할 수 있습니다.
    }
  });

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

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `다운로드 속도: ${progressObj.bytesPerSecond}`;
    message += ` - 진행 상태: ${progressObj.percent}%`;
    message += ` (${progressObj.transferred}/${progressObj.total})`;
  
    // 이 메시지를 사용하여 UI에 진행 상태를 표시할 수 있습니다.
    // 예: mainWindow.webContents.send('download-progress', message);
  });
  
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '업데이트 버전 설치',
      message: '업데이트 버전이 있습니다. 지금 적용하시겠습니까?',
      buttons: ['예', '나중에']
    }).then(result => {
      if (result.response === 0) { // '예' 버튼
        updateApproved = true;
      } else {
        updateApproved = false; // '나중에' 버튼을 클릭하면 false로 설정
      }
  
      // 사용자가 업데이트를 승인한 경우에만 업데이트 진행
      if(updateApproved) {
        autoUpdater.quitAndInstall();
      }
    });
  });
});