const { app, BrowserWindow } = require('electron');

function createWindow () {
  // 브라우저 창을 생성
  let win = new BrowserWindow({
    width: 1600,
    height: 800,
    icon: 'public/favicon.ico', // 아이콘 경로 설정
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.setMenu(null); // 메뉴바 제거

  // 리액트 앱을 로드
  win.loadURL('http://localhost:3000/');
}

app.whenReady().then(createWindow);