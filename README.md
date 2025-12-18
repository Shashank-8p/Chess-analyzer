# Chess Analyzer

A powerful, browser-based chess analysis tool that integrates **Stockfish** chess engine for real-time game analysis. This application allows users to analyze chess games, get best move recommendations, and evaluate positions instantly.

## Features

✨ **Real-time Chess Analysis**
- Instant position evaluation using Stockfish engine
- Best move suggestions with depth calculation
- Mate detection and display

♟️ **Interactive Chess Board**
- Full drag-and-drop piece movement
- Visual board flipping (rotate board 180°)
- Highlighted best move squares
- Status display (check, checkmate, draw detection)

📊 **Game Analysis Tools**
- Evaluation bar showing position assessment
- PGN (Portable Game Notation) import support
- Move history tracking
- Score display in centipawns or mate in X

🎮 **User-Friendly Interface**
- Clean, intuitive design
- Real-time depth indicator
- Responsive layout

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Chess Engine:** Stockfish.js (v10.0.2)
- **Chess Library:** chess.js
- **Board Visualization:** chessboard.js
- **Icons:** Font Awesome 6.0.0

## File Structure

```
Chess-analyzer/
├── index.html       # Main HTML structure
├── script.js        # Chess logic and engine integration
├── style.css        # Styling and layout
└── README.md        # This file
```

## How to Use

### Playing Chess
1. Open `index.html` in your web browser
2. Drag pieces to move (white pieces move first)
3. The engine analyzes the position automatically
4. View the evaluation and best move in the sidebar

### Loading a Game
1. Paste PGN notation in the "Load PGN" text area
2. Click the "Analyze" button
3. The board will update to show the game position
4. Analysis will start immediately

### Controls
- **Flip Button:** Rotate the board 180°
- **Reset Button:** Return to starting position
- **Analyze Button:** Start engine analysis on current position

## Key Features Explained

### Evaluation Bar
The vertical bar on the left shows the position evaluation:
- **Light:** White is winning
- **Dark:** Black is winning
- **Center:** Roughly equal position

### Best Move Highlight
The two highlighted squares show:
- **Source:** Where to move from
- **Target:** Where to move to

### Depth Indicator
Shows the search depth (ply) that Stockfish is analyzing. Higher depth = more thorough analysis.

## Installation & Deployment

### Local Usage
1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. No installation or build process required

### Web Hosting
This is a static web application:
- Upload all files to any web hosting service
- Can be deployed as GitHub Pages (currently deployed)
- No backend server required

## API & External Dependencies

- **Stockfish Engine:** CDN link - `https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js`
- **Chessboard CSS:** `https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css`
- **Font Awesome:** CDN link for icons

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with Web Worker support

## Performance Considerations

- Engine analysis runs in a separate Web Worker thread
- Default analysis depth: 15 plies
- Piece images loaded from official chessboard.js CDN
- Optimized for responsive performance

## Known Issues & Limitations

- Stockfish engine is computationally intensive; analysis may take a few seconds
- PGN import supports standard notation
- Analysis starts automatically after each move (can be CPU intensive on older devices)

## Future Enhancements

- [ ] Opening book integration
- [ ] Move suggestion strength adjustment (from beginner to grandmaster level)
- [ ] Game replay with move navigation
- [ ] Save analyzed games
- [ ] Endgame tablebase integration
- [ ] Multiple language support

## Author

**Shashank-8p**

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## Credits

- Stockfish Chess Engine
- chess.js library
- chessboard.js visualization
- Font Awesome icons

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

Created by AI!!!
---

**Enjoy analyzing chess!** ♟️
