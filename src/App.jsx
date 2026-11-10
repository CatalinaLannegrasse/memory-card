import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CardGrid from './components/CardGrid';
import WinModal from './components/WinModal';
import './App.css';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Global audio context and background music controller
let audioCtx = null;
let bgMusicInterval = null;

function startBackgroundMusic() {
  if (bgMusicInterval) return; // Already running

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = new AudioContext();

  // Play a slow, atmospheric chord progression loop (Hextech ambient vibe)
  const chords = [
    [130.81, 196.00, 261.63], // C3, G3, C4
    [116.54, 174.61, 233.08], // Bb2, F3, Bb3
    [98.00, 146.83, 196.00],  // G2, D3, G3
    [110.00, 164.81, 220.00]   // A2, E3, A3
  ];

  let chordIndex = 0;

  function playChord() {
    if (!audioCtx) return;
    const notes = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    notes.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Soft ambient swell
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 4.0);
    });
  }

  playChord();
  bgMusicInterval = setInterval(playChord, 4000); // Repeat every 4 seconds
}

// Sound effects generator
function playSound(type) {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'loss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.error("Audio playback error:", e);
  }
}

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedIds, setClickedIds] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    async function fetchArcaneCharacters() {
      try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];

        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const champData = await champRes.json();
        
        const validArcaneIds = ['Jinx', 'Vi', 'Caitlyn', 'Ekko', 'Jayce', 'Viktor', 'Heimerdinger', 'Singed', 'Warwick', 'Lux'];

        const characters = Object.values(champData.data)
          .filter(champ => validArcaneIds.includes(champ.id))
          .map(champ => ({
            id: champ.id,
            name: champ.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`
          }));

        setCards(shuffleArray(characters));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Data Dragon data:", error);
        setLoading(false);
      }
    }

    fetchArcaneCharacters();
  }, []);

  const handleCardClick = (id) => {
    // Start ambient background music on the very first player click
    startBackgroundMusic();

    if (hasWon) return;

    if (clickedIds.includes(id)) {
      playSound('loss');
      if (score > bestScore) {
        setBestScore(score);
      }
      setScore(0);
      setClickedIds([]);
    } else {
      playSound('click');
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore > bestScore) {
        setBestScore(newScore);
      }

      if (newScore === cards.length) {
        setHasWon(true);
        playSound('win');
        setCards(shuffleArray(cards));
        return;
      }

      setClickedIds([...clickedIds, id]);
    }

    setCards(shuffleArray(cards));
  };

  const restartGame = () => {
    setScore(0);
    setClickedIds([]);
    setHasWon(false);
    setCards(shuffleArray(cards));
  };

  if (loading) {
    return <div className="loading">Loading Arcane characters...</div>;
  }

  return (
    <div className="app">
      <Header score={score} bestScore={bestScore} />
      <CardGrid cards={cards} onCardClick={handleCardClick} />
      {hasWon && <WinModal onRestart={restartGame} />}
    </div>
  );
}

export default App;