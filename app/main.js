const { app, BrowserWindow } = require('electron');
const windowStateManager = require('electron-window-state');

let mainWindow;
const createWindow = () => {
  const mainWindowState = windowStateManager({
    defaultHeight: 600,
    defaultWidth: 800
  });

  mainWindow = new BrowserWindow({
    height: mainWindowState.height,
    width: mainWindowState.width,
    x: mainWindowState.x,
    y: mainWindowState.y
  });

  mainWindowState.manage(mainWindow);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  require('devtron').install();
};

app.on('ready', createWindow);
