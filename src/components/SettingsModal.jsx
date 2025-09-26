import React from 'react';
import { themes } from '../config/themes';

const SettingsModal = ({ isOpen, onClose, theme, setTheme, volume, setVolume }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Settings</h3>
        <div className="py-4 space-y-4">
          <div>
            <label className="label"><span className="label-text">Theme</span></label>
            <select className="select select-bordered w-full" value={theme} onChange={(e) => setTheme(e.target.value)}>
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label"><span className="label-text">Volume</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              className="range"
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <span className="text-sm">{volume}%</span>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;