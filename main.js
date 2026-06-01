const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('export-zip', async (event, { files, defaultName = 'landing' }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Landing Page as ZIP',
    defaultPath: `${defaultName}.zip`,
    filters: [{ name: 'ZIP', extensions: ['zip'] }]
  });

  if (canceled || !filePath) return { ok: false, message: 'Canceled' };

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(filePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve({ ok: true, path: filePath }));
    archive.on('error', (err) => reject({ ok: false, message: err.message }));

    archive.pipe(output);
    for (const filename in files) {
      const content = files[filename];
      archive.append(Buffer.from(content, 'utf8'), { name: filename });
    }

    archive.finalize();
  });
});
