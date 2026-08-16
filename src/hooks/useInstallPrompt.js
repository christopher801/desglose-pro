import { useState, useEffect, useCallback, useRef } from 'react';

const DISMISS_KEY = 'dp_install_banner_dismissed_until';

function detectIOS() {
  const ua = window.navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIOSDevice && isSafari;
}

function detectStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export function useInstallPrompt() {
  const deferredPromptRef = useRef(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(detectStandalone());
  const [isIOS] = useState(detectIOS());

  useEffect(() => {
    if (isInstalled) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) return null;

    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    deferredPromptRef.current = null;
    setCanInstall(false);
    return choice; // { outcome: 'accepted' | 'dismissed', platform }
  }, []);

  const dismissBanner = useCallback((days = 14) => {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(DISMISS_KEY, String(until));
  }, []);

  const isBannerDismissed = useCallback(() => {
    const until = window.localStorage.getItem(DISMISS_KEY);
    if (!until) return false;
    return Date.now() < Number(until);
  }, []);

  return {
    canInstall,     // true si Chrome/Edge/Android soti prèt pou pwopoze enstalasyon
    isInstalled,    // true si app la deja ap kouri kòm PWA
    isIOS,          // true si se Safari sou iPhone/iPad (pa gen prompt natif)
    promptInstall,
    dismissBanner,
    isBannerDismissed,
  };
}