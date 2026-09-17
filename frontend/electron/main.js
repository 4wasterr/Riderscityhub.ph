import { createRequire } from "module";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const distPath = path.join(app.getAppPath(), "dist", "index.html");
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (app.isPackaged) {
    mainWindow.loadFile(distPath).catch((error) => {
      console.error(`Unable to load Electron packaged page: ${distPath}`, error);
    });
  } else if (devServerUrl) {
    mainWindow.loadURL(devServerUrl).catch((error) => {
      console.error(`Unable to load Electron dev server: ${devServerUrl}`, error);
      if (fs.existsSync(distPath)) {
        mainWindow.loadFile(distPath);
      }
    });
  } else if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath).catch((error) => {
      console.error(`Unable to load dist file: ${distPath}`, error);
    });
  } else {
    mainWindow.loadURL("http://localhost:5173").catch((error) => {
      console.error("Unable to load dev server on http://localhost:5173", error);
    });
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});