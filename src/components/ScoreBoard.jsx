export default function Scoreboard({ score, bestScore }) {
  return (
    <div className="scoreboard">
      <div className="score-box">Score: <span>{score}</span></div>
      <div className="score-box">Best Score: <span>{bestScore}</span></div>
    </div>
  );
}