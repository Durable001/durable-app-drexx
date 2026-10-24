import { useState } from "react";
import { FiDownload, FiPlusSquare } from "react-icons/fi";
import BottomSheet from "@/components/ui/BottomSheet";
import { ALREADY_INSTALLED, INSTALL_BENEFITS, IOS_STEPS, MANUAL_STEPS } from "@/constants/install";

const appName = () => process.env.REACT_APP_NAME || "this app";

/** "Tap the **Share** button" -> Tap the <b>Share</b> button, with {app} filled in. */
const rich = text =>
  text
    .replaceAll("{app}", appName())
    .split("**")
    .map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));

const Steps = ({ steps }) => (
  <ol className="install-steps">
    {steps.map(({ icon: Icon, text }) => (
      <li key={text}>
        <Icon size={22} />
        <span>{rich(text)}</span>
      </li>
    ))}
  </ol>
);

/**
 * "Install {app} on your {device}" sheet. What it offers depends on `pwa.mode` (see usePwaInstall):
 *  prompt -> an Install button that fires the browser's native install dialog
 *  ios    -> steps for Safari's own Share button (web pages cannot open Add to Home Screen) + a look-alike of the row to find
 *  manual -> browser-menu steps for browsers that give us no install prompt
 */
export default function InstallSheet({ open, onClose, pwa }) {
  const { mode, platform, deviceName, iosSafari, install } = pwa;
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const result = await install();
      if (result === "accepted" || result === "dismissed") onClose(); // native dialog answered either way
    } finally {
      setBusy(false);
    }
  };

  const place = platform === "desktop" ? "desktop" : "home screen";
  const subtitle =
    mode === "prompt"
      ? `Add it to your ${place} for one-tap access.`
      : mode === "ios"
        ? "Add it to your home screen from Safari’s Share menu."
        : "Your browser will walk you through it.";

  return (
    <BottomSheet open={open} onClose={onClose}>
      {titleId => (
        <div className="install-sheet">
          <div className="install-sheet-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="install-sheet-icon" width={56} height={56} />
            <div>
              <h2 id={titleId} className="install-sheet-title">
                Install {appName()} on your {deviceName}
              </h2>
              <p className="install-sheet-sub">{subtitle}</p>
            </div>
          </div>

          {mode === "prompt" && (
            <>
              <ul className="install-benefits">
                {INSTALL_BENEFITS.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon size={20} />
                    {label}
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary1 btn-lg install-sheet-btn" onClick={run} disabled={busy}>
                <FiDownload /> {busy ? "Waiting for your browser…" : "Install app"}
              </button>
            </>
          )}

          {mode === "ios" && (
            <>
              <Steps steps={IOS_STEPS} />
              <div className="install-mock" aria-hidden="true">
                <span>Add to Home Screen</span>
                <FiPlusSquare size={22} />
              </div>
              {!iosSafari && (
                <p className="install-sheet-note warn">
                  Not seeing “Add to Home Screen”? Open this page in <b>Safari</b> and try again.
                </p>
              )}
              <button type="button" className="btn btn-primary1 btn-lg install-sheet-btn" onClick={onClose}>
                Got it
              </button>
            </>
          )}

          {mode === "manual" && (
            <>
              <Steps steps={MANUAL_STEPS[platform === "android" ? "android" : "desktop"]} />
              <p className="install-sheet-note">{ALREADY_INSTALLED[platform]}</p>
              <button type="button" className="btn btn-outline-primary1 btn-lg install-sheet-btn" onClick={onClose}>
                Got it
              </button>
            </>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
