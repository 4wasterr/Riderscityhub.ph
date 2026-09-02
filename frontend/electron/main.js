import { app, BrowserWindow } from "electron";
import path from "path";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const page = app.isPackaged
    ? path.join(app.getAppPath(), "dist", "index.html")
    : process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

  const loadPage = app.isPackaged
    ? mainWindow.loadFile(page)
    : mainWindow.loadURL(page);

  loadPage.catch((error) => {
    console.error(`Unable to load Electron page: ${page}`, error);
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});