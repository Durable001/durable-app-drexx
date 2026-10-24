import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { INSTALL_CTA } from "@/constants/install";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import InstallSheet from "./InstallSheet";

/** Landing hero "Tap to Install" button + the bottom sheet it opens. Hidden once the app is installed / running installed. */
export default function InstallCta() {
  const pwa = usePwaInstall();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pwa.installed) setOpen(false);
  }, [pwa.installed]);

  if (!pwa.showInstallCta) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-gold btn-lg hero-install"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog">
        <FiDownload /> {pwa.isMobile ? INSTALL_CTA.mobile : INSTALL_CTA.desktop}
      </button>
      <InstallSheet open={open} onClose={() => setOpen(false)} pwa={pwa} />
    </>
  );
}
