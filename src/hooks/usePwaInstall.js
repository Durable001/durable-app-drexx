import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  detectEnvironment,
  getServerSnapshot,
  getSnapshot,
  isStandalone,
  promptInstall,
  readDismissed,
  subscribe,
  writeDismissed,
} from "@/lib/pwa";

/**
 * Install state for the banner and the desktop top-bar button.
 *  - android/desktop (Chromium): native prompt via beforeinstallprompt
 *  - ios: Safari has no install API and web pages cannot open "Add to Home Screen",
 *    so install() resolves to "instructions" and the UI shows the steps.
 */
export function usePwaInstall() {
  const { deferredPrompt, installed } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [env, setEnv] = useState({
    ready: false,
    platform: "desktop",
    deviceName: "device",
    iosSafari: true,
    standalone: false,
  });
  const [dismissed, setDismissed] = useState(true); // hidden until storage is read

  useEffect(() => {
    setEnv({ ready: true, ...detectEnvironment() });
    setDismissed(readDismissed());

    const mq = window.matchMedia?.("(display-mode: standalone)");
    const onChange = () => setEnv(prev => ({ ...prev, standalone: isStandalone() }));
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const dismiss = useCallback(() => {
    writeDismissed();
    setDismissed(true);
  }, []);

  /** Resolves to: accepted | dismissed | shared | cancelled | instructions | unavailable */
  const install = useCallback(async () => {
    if (deferredPrompt) return promptInstall();

    // iOS: navigator.share opens a generic web-share sheet that has NO "Add to Home Screen" (verified on iPhone),
    // so we never call it. Only Safari's own Share button has that action: show the steps instead.
    if (env.platform === "ios") return "instructions";
    return "unavailable";
  }, [deferredPrompt, env.platform]);

  const isMobile = env.platform === "ios" || env.platform === "android";
  const canInstall = env.ready && !env.standalone && !installed && (!!deferredPrompt || env.platform === "ios");

  // what the install sheet should show:
  //  prompt -> one-tap native install (Chromium on Android / Windows / Mac / Linux / ChromeOS)
  //  ios    -> "Add to Home Screen" steps via Safari's own Share button (no install API exists)
  //  manual -> no prompt available (already installed, unsupported browser, dev build): menu steps
  const mode = deferredPrompt ? "prompt" : env.platform === "ios" ? "ios" : "manual";

  return {
    ...env,
    mode,
    installed,
    dismissed,
    dismiss,
    install,
    isMobile,
    canPrompt: !!deferredPrompt,
    canInstall,
    // banner: phones only (Android needs the prompt event, iOS is always manual)
    showBanner: canInstall && isMobile && !dismissed,
    // desktop gets a quiet icon in the top bar instead of a banner
    showDesktopButton: canInstall && !isMobile,
    // landing hero button: shown on every device that isn't already running the installed app, so it never
    // "disappears" just because the browser hasn't fired beforeinstallprompt (the sheet explains what to do)
    showInstallCta: env.ready && !env.standalone && !installed,
  };
}
