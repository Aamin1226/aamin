import { app, BrowserWindow, screen, ipcMain, globalShortcut, desktopCapturer } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { uIOhook } from 'uiohook-napi';
const ffi = require('ffi-napi');
const ref = require('ref-napi');


const int = ref.types.int;
const voidPtr = ref.refType(ref.types.void);
const user32 = ffi.Library('user32', {
  'GetForegroundWindow': ['void*', []],
  'GetWindowTextA': ['int', ['void*', 'string', 'int']],
});

const kernel32 = ffi.Library('kernel32', {
  'GetLastError': ['int', []],
});

function getFocusedWindowDetails() {
  const windowHandle = user32.GetForegroundWindow();
  const buffer = Buffer.alloc(255); // Buffer to hold the window title
  const result = user32.GetWindowTextA(windowHandle, buffer, 255);

  if (result !== 0) {
    const windowTitle = buffer.toString('utf8');
    return windowTitle;
  } else {
    const error = kernel32.GetLastError();
    throw new Error(`Failed to get window details. Error code: ${error}`);
  }
}





uIOhook.on('click', (e) => {
  // captureScreenshot();
  // console.log(e);
  const focusedWindowDetails = getFocusedWindowDetails();
  console.log(focusedWindowDetails);

})

uIOhook.start();

let mainWindow: BrowserWindow | null = null;
let newWindow: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createMainWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();
    require('electron-reloader')(module);
    mainWindow.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    mainWindow.loadURL(url.href);
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });



  return mainWindow;
}

function createNewWindow(): BrowserWindow {
  newWindow = new BrowserWindow({
    width:160,
    height:120,
    frame: false,
    resizable:false,
    maximizable:false,
    minimizable:false,
    alwaysOnTop :true,
     webPreferences: {
      nodeIntegration: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load the customizable HTML content
  const filePath = path.join(__dirname, './recording.html');
  newWindow.loadFile(filePath);

  // Emitted when the window is closed.
  newWindow.on('closed', () => {
    newWindow = null;
  });

  return newWindow;
}

try {
  app.on('ready', () => {
    createMainWindow();
    globalShortcut.register(
      process.platform === 'darwin' ? 'Command+K' : 'Ctrl+K',
      () => {
        if (mainWindow && mainWindow.isMinimized()) {
          captureScreenshot();
        }
      }
    );
  });



  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createMainWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('messageToMain', (event, message) => {
  if (mainWindow) {
    mainWindow.minimize();
    createNewWindow();
  }
});

ipcMain.on('stop', (event, message) => {
  if (newWindow) {
    newWindow.close();
    mainWindow?.maximize();
  }
});


function captureScreenshot() {
  newWindow?.hide()
  const cursorScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const thumbSize = cursorScreen.workAreaSize;
  desktopCapturer.getSources({ types: ['screen'], thumbnailSize: thumbSize })
    .then((sources) => {
      const source = sources.find(source => source.display_id === cursorScreen.id.toString());
      if (source) {
        const screenshotPath = path.join(app.getPath('pictures'), 'Screenshots');
        if (!fs.existsSync(screenshotPath)) {
          fs.mkdirSync(screenshotPath);
        }
        const screenshotFilePath = path.join(screenshotPath, `${Date.now()}.png`);

        fs.writeFile(screenshotFilePath, source.thumbnail.toPNG(), (error) => {
          if (error) {
            console.error('Error saving screenshot:', error);
            return;
          }

          console.log('Screenshot saved:', screenshotFilePath);
          newWindow?.show()
        });
      }
    })
    .catch((error) => {
      console.error('Error capturing screenshot:', error);
    });
}