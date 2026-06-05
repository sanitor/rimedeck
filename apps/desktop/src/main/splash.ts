import { BrowserWindow } from "electron";
import { readFileSync } from "node:fs";

let splashWindow: BrowserWindow | null = null;

function buildSplashHTML(iconBase64: string): string {
  const iconSrc = iconBase64
    ? `data:image/png;base64,${iconBase64}`
    : "";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #0c0c11;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    -webkit-app-region: drag;
    user-select: none;
    overflow: hidden;
  }
  .icon { width: 72px; height: 72px; margin-bottom: 18px; border-radius: 14px; }
  .title { font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: 0.3px; }
  .spinner {
    width: 20px; height: 20px;
    border: 2px solid #2a2a35;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-top: 24px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  #status {
    font-size: 12px;
    color: #6b6b7b;
    margin-top: 12px;
    min-height: 18px;
    transition: opacity 0.2s;
  }
</style>
</head>
<body>
  ${iconSrc ? `<img class="icon" src="${iconSrc}" />` : ""}
  <div class="title">RimeDeck</div>
  <div class="spinner"></div>
  <div id="status">Starting...</div>
</body>
</html>`;
}

export function showSplash(iconPath: string): void {
  let iconBase64 = "";
  try {
    const buf = readFileSync(iconPath);
    iconBase64 = buf.toString("base64");
  } catch {
    // Icon not found — splash renders without it
  }

  splashWindow = new BrowserWindow({
    width: 360,
    height: 320,
    frame: false,
    resizable: false,
    center: true,
    skipTaskbar: false,
    backgroundColor: "#0c0c11",
    show: false,
    ...(process.platform === "linux" ? { icon: iconPath } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const html = buildSplashHTML(iconBase64);
  splashWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
  );
  splashWindow.once("ready-to-show", () => splashWindow?.show());
}

export function updateSplashStatus(message: string): void {
  if (!splashWindow || splashWindow.isDestroyed()) return;
  const escaped = JSON.stringify(message);
  splashWindow.webContents
    .executeJavaScript(
      `document.getElementById('status').textContent = ${escaped}`,
    )
    .catch(() => {});
}

export function closeSplash(): void {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
  }
  splashWindow = null;
}
