# Chess Analyzer

A lightweight, browser-based chess analysis tool powered by the **Stockfish** engine. Analyze games, evaluate positions instantly, and get best move recommendations right in your browser.

---

## ✨ Key Features

*   **Real-time Analysis:** Instant evaluation and best move suggestions using Stockfish.
*   **Interactive Board:** Full drag-and-drop support, visual board flipping, and highlighted move squares.
*   **Game Tools:** Visual evaluation bar, PGN (Portable Game Notation) import, and automatic mate/draw detection.

## 🚀 Getting Started

This is a completely static web app with zero dependencies to install. 

1. Download or clone the repository.
2. Open `index.html` in any modern web browser.
3. *Optional:* Upload the files to any static web hosting service (like GitHub Pages) to deploy.

## 🎮 How to Use

*   **Play/Analyze:** Drag and drop pieces on the board. Stockfish analyzes the position automatically after every move.
*   **Load a Game:** Paste standard PGN notation into the "Load PGN" box and hit **Analyze**.
*   **Controls:** Use the interface buttons to **Flip** the board 180°, **Reset** to the starting position, or check the **Evaluation Bar** (Light = White winning, Dark = Black winning).

## 🔮 Planned Features

*   **Opening Explorer:** Integration with standard opening books.
*   **Adjustable Engine Strength:** Tweak move suggestions from Beginner up to Grandmaster level.
*   **Game Navigation:** Controls to step forward and backward through game moves.
*   **Save & Export:** Ability to save your analyzed games locally.
*   **Endgame Tablebases:** Perfect play integration for complex endgames.
*   **Localization:** Support for multiple languages.

## 🛠️ Built With

*   **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6)
*   **Engine:** Stockfish.js (v10.0.2) via Web Workers
*   **Libraries:** chess.js (logic) & chessboard.js (UI)

---

**Author:** Shashank-8p | Open-source for personal and educational use.
