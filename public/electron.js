const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;
let isDev;

import('electron-is-dev').then((module) => {
  isDev = module.default;
  
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

  function showUpdateConfirmModal() {
    let modal = new BrowserWindow({
      width: 400,
      height: 200,
      parent: win, // mainWindow는 메인 BrowserWindow 인스턴스의 변수명입니다.
      modal: true,
      show: false,
      frame: false, // 최소화 및 닫기 버튼 제거
      webPreferences: {
        preload: path.join(__dirname, '../build/preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
      }
    });
  
    modal.loadURL(`file://${path.join(__dirname, '../build/updateConfirm.html')}`); // 업데이트 확인 HTML 파일 로드
  
    modal.once('ready-to-show', () => {
      modal.show();
    });
  
    // 모달 창에서 응답을 받음
    ipcMain.once('update-confirm-response', (event, acceptUpdate) => {
      if (acceptUpdate) {
        autoUpdater.quitAndInstall();
      }
      modal.close();
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

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `다운로드 속도: ${progressObj.bytesPerSecond}`;
    message += ` - 진행 상태: ${progressObj.percent}%`;
    message += ` (${progressObj.transferred}/${progressObj.total})`;
  
    // 이 메시지를 사용하여 UI에 진행 상태를 표시할 수 있습니다.
    // 예: mainWindow.webContents.send('download-progress', message);
  });
  
  autoUpdater.on('update-downloaded', () => {
    // dialog.showMessageBox 대신 새로 작성한 모달 함수를 사용합니다.
    showUpdateConfirmModal();
  });
});