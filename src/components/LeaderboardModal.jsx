import React from 'react';

const LeaderboardModal = ({ isOpen, onClose, leaderboard }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg">Leaderboard</h3>
        <ul className="py-3 space-y-2">
          {leaderboard.length ? (
            leaderboard.map((s, i) => (
              <li key={i} className="flex justify-between">
                <span className="opacity-70">#{i + 1}</span>
                <span className="font-semibold">{s}</span>
              </li>
            ))
          ) : (
            <li className="opacity-70">No scores yet</li>
          )}
        </ul>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;