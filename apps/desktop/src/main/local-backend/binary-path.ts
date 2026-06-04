import { app } from "electron";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { join } from "node:path";

function binName(name: string): string {
  return process.platform === "win32" ? `${name}.exe` : name;
}

export function bundledBinaryPath(name: string): string {
  return join(app.getAppPath(), "resources", "bin", binName(name)).replace(
    "app.asar",
    "app.asar.unpacked",
  );
}

async function which(name: string): Promise<string | null> {
  const cmd = process.platform === "win32" ? "where.exe" : "which";
  try {
    const stdout = await new Promise<string>((resolve, reject) => {
      execFile(cmd, [binName(name)], { timeout: 5_000 }, (err, out) => {
        if (err) reject(err);
        else resolve(out);
      });
    });
    const path = stdout.trim().split("\n")[0]?.trim();
    return path || null;
  } catch {
    return null;
  }
}

export async function resolveBinary(name: string): Promise<string> {
  const bundled = bundledBinaryPath(name);
  try {
    await access(bundled, constants.X_OK);
    return bundled;
  } catch {
    // fall through
  }

  // On Windows, X_OK may not be meaningful — check existence separately
  if (process.platform === "win32") {
    try {
      await access(bundled, constants.F_OK);
      return bundled;
    } catch {
      // fall through
    }
  }

  const onPath = await which(name);
  if (onPath) return onPath;

  throw new Error(
    `[local-backend] Binary '${name}' not found. ` +
      "Ensure the Go backend was built (run bundle-cli.mjs) or the binary is in PATH.",
  );
}
