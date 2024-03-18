require('dotenv').config();
const { exec } = require('child_process');

exec('electron-builder build --win --publish always', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});