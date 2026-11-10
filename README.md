# 🃏 Arcane Memory Card Game

An interactive, browser-based memory card game inspired by the hit series **Arcane** and built with **React** and **Vite**. Tested by trying to remember characters without clicking any champion twice!

---

## 🛠️ Built With

*   **React** (Hooks: `useState`, `useEffect`, `useRef`)
*   **Vite** (Next-generation frontend tooling)
*   **Riot Games Data Dragon API** (Dynamic champion art and metadata)
*   **Web Audio API** (Custom synthesized ambient background music and sound effects)
*   **CSS3** (Custom Hextech theme, responsive grid, and smooth hover animations)

---

## 🎮 How to Play

1. The game displays a grid of distinct **Arcane / League of Legends** character cards.
2. Click on any card to earn a point.
3. Every time you click a card, all the cards will **shuffle randomly**.
4. **The Catch:** If you click the *same card twice* during a round, your current score resets to `0` and your streak ends!
5. **Win Condition:** Successfully click every unique character card once without repeating to win the game.