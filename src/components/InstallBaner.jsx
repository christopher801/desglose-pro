import React, { useState, useEffect } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function InstallBaner() {
  const { canInstall, isInstalled, isIOS, promptInstall, dismissBanner, isBannerDismissed } = useInstallPrompt();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (isInstalled) { setVisible(false); return; }
    if (isBannerDismissed()) return;
    if (canInstall || isIOS) {
      setVisible(true);
      const t = setTimeout(() => setEntered(true), 30);
      return () => clearTimeout(t);
    }
  }, [canInstall, isIOS, isInstalled, isBannerDismissed]);

  if (!visible) return null;

  const handleInstall = async () => {
    if (isIOS) return; // el banner solo muestra instrucciones para iOS, no hay prompt nativo
    const choice = await promptInstall();
    if (choice) setVisible(false);
  };

  const handleDismiss = () => {
    dismissBanner(14);
    setEntered(false);
    setTimeout(() => setVisible(false), 220);
  };

  return (
    <div className={`iban-root${entered ? ' iban-in' : ''}`}>
      <style>{`
        .iban-root {
          position: fixed; left: 1rem; right: 1rem; bottom: 1rem; z-index: 2000;
          max-width: 420px; margin: 0 auto;
          transform: translateY(20px); opacity: 0;
          transition: transform 0.35s ease, opacity 0.35s ease;
        }
        .iban-root.iban-in { transform: translateY(0); opacity: 1; }

        .iban-card {
          background: #0d1e3d;
          border: 1px solid rgba(96, 165, 250, 0.22);
          border-radius: 14px;
          padding: 1.1rem 1.15rem;
          box-shadow: 0 20px 45px -12px rgba(0,0,0,0.45);
          display: flex; align-items: flex-start; gap: 0.85rem;
          position: relative;
        }

        .iban-icon {
          flex-shrink: 0;
          width: 42px; height: 42px; border-radius: 9px;
          background: linear-gradient(135deg, #3b82f6, #1e3a8a);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1.2rem;
        }

        .iban-body { flex: 1; min-width: 0; }
        .iban-title { color: #fff; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem; }
        .iban-desc { color: #94a3b8; font-size: 0.82rem; line-height: 1.5; margin-bottom: 0.75rem; }

        .iban-actions { display: flex; gap: 0.6rem; }
        .iban-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: #fff;
          border: none; border-radius: 7px; padding: 0.5rem 0.95rem;
          font-size: 0.8rem; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .iban-btn-text {
          background: transparent; color: #94a3b8; border: none;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0.5rem 0.4rem;
        }
        .iban-btn-text:hover { color: #cbd5e1; }

        .iban-close {
          position: absolute; top: 8px; right: 8px;
          background: transparent; border: none; color: #64748b;
          font-size: 0.95rem; cursor: pointer; padding: 4px;
          line-height: 1;
        }
        .iban-close:hover { color: #cbd5e1; }

        @media (max-width: 480px) {
          .iban-root { left: 0.6rem; right: 0.6rem; bottom: 0.6rem; }
        }
      `}</style>

      <div className="iban-card">
        <button className="iban-close" onClick={handleDismiss} aria-label="Cerrar">
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="iban-icon"><i className="bi bi-phone-vibrate"></i></div>

        <div className="iban-body">
          <div className="iban-title">Instala Desglose Pro</div>
          <div className="iban-desc">
            {isIOS
              ? <>Toca <strong>Compartir</strong> <i className="bi bi-box-arrow-up"></i> y luego "Agregar a pantalla de inicio" para usarla sin conexión.</>
              : 'Úsala como app nativa, sin conexión, directo desde tu pantalla de inicio.'}
          </div>

          <div className="iban-actions">
            {!isIOS && (
              <button className="iban-btn-primary" onClick={handleInstall}>
                <i className="bi bi-download"></i> Instalar
              </button>
            )}
            <button className="iban-btn-text" onClick={handleDismiss}>Ahora no</button>
          </div>
        </div>
      </div>
    </div>
  );
}