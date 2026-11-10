import Scoreboard from './ScoreBoard';

export default function Header({ score, bestScore }) {
  return (
    <header className="header">
      <div>
        <h1>Arcane Memory Game</h1>
        <p className="instructions">Earn points by clicking a card, but don't click any card more than once!</p>
      </div>
      <Scoreboard score={score} bestScore={bestScore} />
    </header>
  );
}