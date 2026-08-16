import React, { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function InstallButton({ className = '', label = 'Instalar App' }) {
  const { canInstall, isInstalled, isIOS, promptInstall } = useInstallPrompt();
  const [showIOSTip, setShowIOSTip] = useState(false);

  if (isInstalled) return null;
  if (!canInstall && !isIOS) return null;

  const handleClick = () => {
    if (isIOS) {
      setShowIOSTip((v) => !v);
      return;
    }
    promptInstall();
  };

  return (
    <div className={`ib-wrap ${className}`}>
      <style>{`
        .ib-wrap { position: relative; display: inline-block; }
        .ib-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, #3b82f6, #1e3a8a);
          color: #fff; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.88rem;
          padding: 0.6rem 1.15rem; border-radius: 8px;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ib-btn:hover { transform: translateY(-1px); box-shadow: 0 0 26px rgba(59, 130, 246, 0.4); }
        .ib-btn i { font-size: 1rem; }

        .ib-tip {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 240px; background: #0d1e3d; color: #e2e8f0;
          border: 1px solid rgba(96, 165, 250, 0.25);
          border-radius: 10px; padding: 0.9rem 1rem;
          font-size: 0.8rem; line-height: 1.5;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
          z-index: 50;
        }
        .ib-tip strong { color: #60a5fa; }
        .ib-tip::before {
          content: ''; position: absolute; top: -6px; right: 18px;
          width: 12px; height: 12px; background: #0d1e3d;
          border-left: 1px solid rgba(96, 165, 250, 0.25);
          border-top: 1px solid rgba(96, 165, 250, 0.25);
          transform: rotate(45deg);
        }
      `}</style>

      <button className="ib-btn" onClick={handleClick} type="button">
        <i className="bi bi-download"></i> {label}
      </button>

      {isIOS && showIOSTip && (
        <div className="ib-tip">
          En iPhone/iPad: toca <strong>Compartir</strong> <i className="bi bi-box-arrow-up"></i> abajo,
          luego elige <strong>"Agregar a pantalla de inicio"</strong>.
        </div>
      )}
    </div>
  );
}