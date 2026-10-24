import { FiMaximize, FiZap, FiCheckCircle, FiDownload } from "react-icons/fi";
import { IoShareOutline, IoAddCircleOutline, IoCheckmarkCircleOutline, IoEllipsisVertical } from "react-icons/io5";

/** Copy + steps for the landing "Tap to Install" sheet. `{app}` is replaced with the app name at render time. */

export const INSTALL_CTA = { mobile: "Tap to Install", desktop: "Click to Install" };

export const INSTALL_BENEFITS = [
  { icon: FiMaximize, label: "Full-screen view" },
  { icon: FiZap, label: "Opens faster" },
  { icon: FiCheckCircle, label: "No app store" },
];

/** iPhone / iPad: only Safari's own Share button has "Add to Home Screen" (navigator.share's sheet does not). */
export const IOS_STEPS = [
  { icon: IoShareOutline, text: "Tap your browser's **Share** button, next to the address bar (or in the bottom toolbar)." },
  { icon: IoAddCircleOutline, text: "Scroll down the list, past Print, and tap **Add to Home Screen**." },
  { icon: IoCheckmarkCircleOutline, text: "Tap **Add**. {app} now opens like a regular app." },
];

/** Shown when the browser has no install prompt to hand us (already installed, Firefox/Safari desktop, dev build...). */
export const MANUAL_STEPS = {
  android: [
    { icon: IoEllipsisVertical, text: "Tap the **⋮ menu** in your browser." },
    { icon: FiDownload, text: "Choose **Install app** or **Add to Home screen**." },
    { icon: IoCheckmarkCircleOutline, text: "Confirm, and {app} lands on your home screen." },
  ],
  desktop: [
    { icon: FiDownload, text: "Click the **install icon** at the right end of the address bar." },
    { icon: IoEllipsisVertical, text: "No icon? Open the browser **menu** and choose **Install {app}**." },
    { icon: IoCheckmarkCircleOutline, text: "Confirm, and {app} opens in its own window." },
  ],
};

export const ALREADY_INSTALLED = {
  android: "Already installed? Open it from your home screen or app drawer.",
  ios: "Already installed? Open it from your home screen.",
  desktop: "Already installed? Open it from your Start menu, Dock or desktop, or use “Open in app” in the address bar.",
};
