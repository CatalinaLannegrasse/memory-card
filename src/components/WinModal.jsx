export default function WinModal({ onRestart }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🎉 Victory! 🎉</h2>
        <p>Incredible! You remembered every single character without clicking any card twice.</p>
        <button className="restart-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}