import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Unplug, Link2 } from "lucide-react";
import { DragStrip } from "@multica/views/platform";
import { MulticaIcon } from "@multica/ui/components/common/multica-icon";
import { Button } from "@multica/ui/components/ui/button";
import { Input } from "@multica/ui/components/ui/input";
import { useAuthStore } from "@multica/core/auth";
import { JoinWorkspaceDialog } from "@multica/views/workspace/join-workspace-dialog";

type Phase = "connecting" | "failed" | "expired" | "rejoin";

interface Props {
  apiUrl: string;
}

export function RemoteReconnectPage({ apiUrl }: Props) {
  const [phase, setPhase] = useState<Phase>("connecting");
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");
  const attemptedRef = useRef(false);
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);

  const tryConnect = useCallback(async (targetUrl?: string) => {
    setPhase("connecting");
    setError("");

    if (targetUrl && targetUrl !== apiUrl) {
      const desktopAPI = (window as unknown as Record<string, unknown>).desktopAPI as
        | { switchRuntimeConfig?: (c: { apiUrl: string; wsUrl: string; authToken?: string }) => Promise<void> }
        | undefined;
      if (desktopAPI?.switchRuntimeConfig) {
        const wsUrl = targetUrl.replace(/^http/, "ws") + "/ws";
        const token = localStorage.getItem("multica_token") ?? undefined;
        await desktopAPI.switchRuntimeConfig({ apiUrl: targetUrl, wsUrl, authToken: token });
      }
    }

    try {
      await initialize();
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        window.location.reload();
      } else {
        const token = localStorage.getItem("multica_token");
        setPhase(token ? "failed" : "expired");
        setError(token ? "Unable to reach the server" : "Credentials expired");
      }
    } catch {
      setPhase("failed");
      setError("Connection failed");
    }
  }, [apiUrl, initialize]);

  useEffect(() => {
    if (attemptedRef.current || user) return;
    attemptedRef.current = true;

    // Restore JWT from disk if localStorage was cleared.
    (async () => {
      const desktopAPI = (window as unknown as Record<string, unknown>).desktopAPI as
        | { getRemoteAuthToken?: () => Promise<string | null> }
        | undefined;
      const diskToken = await desktopAPI?.getRemoteAuthToken?.();
      if (diskToken && !localStorage.getItem("multica_token")) {
        localStorage.setItem("multica_token", diskToken);
      }
      void tryConnect();
    })();
  }, [tryConnect, user]);

  const handleRetry = () => void tryConnect();

  const handleChangeUrl = () => {
    const base = newUrl.trim().replace(/\/+$/, "");
    if (!base) return;
    const url = base.startsWith("http") ? base : `http://${base}`;
    void tryConnect(url);
  };

  const handleDisconnect = async () => {
    const dAPI = (window as unknown as Record<string, { disconnectRuntimeConfig?: () => Promise<void> }>).desktopAPI;
    const daemon = (window as unknown as Record<string, {
      setTargetApiUrl?: (u: string) => Promise<void>;
      clearToken?: () => Promise<void>;
      restart?: () => Promise<unknown>;
    }>).daemonAPI;
    await dAPI?.disconnectRuntimeConfig?.();
    localStorage.removeItem("multica_token");
    localStorage.removeItem("rimedeck_remote_server");
    try {
      await daemon?.clearToken?.();
      await daemon?.setTargetApiUrl?.("");
      await daemon?.restart?.();
    } catch { /* best effort */ }
    window.location.reload();
  };

  if (phase === "rejoin") {
    return <JoinWorkspaceDialog onClose={() => setPhase("expired")} />;
  }

  const displayUrl = apiUrl.replace(/^https?:\/\//, "");

  return (
    <div className="flex h-screen flex-col">
      <DragStrip />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <MulticaIcon bordered size="lg" />

        {phase === "connecting" && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting to {displayUrl}…
            </div>
          </>
        )}

        {phase === "failed" && (
          <div className="flex w-full max-w-sm flex-col gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Cannot reach <span className="font-mono text-foreground">{displayUrl}</span>
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button size="sm" onClick={handleRetry}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Server address changed?
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="new-address:18080"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="font-mono text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleChangeUrl()}
                />
                <Button size="sm" onClick={handleChangeUrl} disabled={!newUrl.trim()}>
                  Connect
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDisconnect}>
              <Unplug className="mr-1.5 h-3.5 w-3.5" />
              Disconnect
            </Button>
          </div>
        )}

        {phase === "expired" && (
          <div className="flex w-full max-w-sm flex-col gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Credentials for <span className="font-mono text-foreground">{displayUrl}</span> have expired.
            </p>
            <p className="text-xs text-muted-foreground">
              Ask the workspace admin for a new invite code.
            </p>

            <Button size="sm" onClick={() => setPhase("rejoin")}>
              <Link2 className="mr-1.5 h-3.5 w-3.5" />
              Rejoin workspace
            </Button>

            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDisconnect}>
              <Unplug className="mr-1.5 h-3.5 w-3.5" />
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
