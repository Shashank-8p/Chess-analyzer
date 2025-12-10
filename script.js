// --- UPDATED IMPORTS (Use unpkg.com) ---
import { Chessboard, FEN, COLOR } from "https://unpkg.com/cm-chessboard@8.5.0/src/cm-chessboard/Chessboard.js";
import { ARROW_TYPE, Arrows } from "https://unpkg.com/cm-chessboard@8.5.0/src/cm-chessboard/extensions/arrows/Arrows.js";
import { MARKERS, Markers } from "https://unpkg.com/cm-chessboard@8.5.0/src/cm-chessboard/extensions/markers/Markers.js";

// --- Game State ---
const game = new Chess();
let board = null;
let stockfish = null;
let isEngineReady = false;

// --- Initialize Board ---
board = new Chessboard(document.getElementById("board"), {
    position: FEN.start,
    // CRITICAL: Update this asset URL too!
    assetsUrl: "https://unpkg.com/cm-chessboard@8.5.0/assets/",
    style: { cssClass: "default" },
    extensions: [
        { class: Markers, props: { autoMarkers: MARKERS.FRAME } },
        { class: Arrows, props: {} }
    ]
});

// Enable Move Input
board.enableMoveInput((event) => {
    switch (event.type) {
        case "moveInputFinished":
            // Validate move with chess.js
            const move = game.move({
                from: event.squareFrom,
                to: event.squareTo,
                promotion: 'q'
            });

            if (move) {
                event.chessboard.setPosition(game.fen());
                updateStatus();
                startAnalysis(); // Ask engine for analysis
                return true;
            } else {
                return false; // Invalid move, snap back
            }
    }
});

// --- Stockfish Engine Integration ---
function initStockfish() {
    // We use a Blob to load the worker from a CDN without cross-origin issues
    const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
    
    // Create a worker from the script
    fetch(stockfishUrl).then(response => response.blob()).then(blob => {
        const objectURL = URL.createObjectURL(blob);
        stockfish = new Worker(objectURL);

        stockfish.onmessage = function(event) {
            const line = event.data;
            
            // 1. Detect "Best Move"
            if (line.startsWith("bestmove")) {
                const bestMove = line.split(" ")[1];
                document.getElementById("bestMove").innerText = bestMove;
                
                // Draw arrow for best move
                const from = bestMove.substring(0, 2);
                const to = bestMove.substring(2, 4);
                
                // Clear old arrows and draw new one
                board.removeArrows(); 
                board.addArrow(ARROW_TYPE.danger, from, to);
            }

            // 2. Detect Evaluation (cp = centipawns, mate = mate in x)
            if (line.includes("score cp") || line.includes("score mate")) {
                parseEvaluation(line);
            }
            
            // 3. Detect Depth
            if (line.includes("depth")) {
                const depth = line.match(/depth\s+(\d+)/);
                if(depth) document.getElementById("depth").innerText = depth[1];
            }
        };

        stockfish.postMessage("uci");
        isEngineReady = true;
        document.getElementById("status").innerText = "Engine Ready. White to move.";
    });
}

function startAnalysis() {
    if (!stockfish || !isEngineReady) return;
    stockfish.postMessage("stop");
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 15"); // Analyze to depth 15
}

function parseEvaluation(line) {
    let score = 0.0;
    
    // Handle Checkmate
    if (line.includes("mate")) {
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (mateMatch) {
            score = mateMatch[1] > 0 ? 100 : -100; // Visual cap
            document.getElementById("eval-score").innerText = `M${Math.abs(mateMatch[1])}`;
        }
    } 
    // Handle Centipawns (standard score)
    else {
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (cpMatch) {
            score = parseInt(cpMatch[1]) / 100;
            // Adjust score based on turn (Stockfish always gives score relative to active color)
            if (game.turn() === 'b') score = -score;
            
            document.getElementById("eval-score").innerText = score > 0 ? `+${score}` : score;
        }
    }

    updateEvalBar(score);
}

function updateEvalBar(score) {
    // Score is roughly -5 to +5 range for visual bar
    // Clamp score between -5 and 5
    const clampedScore = Math.max(-5, Math.min(5, score));
    
    // Calculate percentage (0% = Black winning, 50% = Draw, 100% = White winning)
    const percentage = 50 + (clampedScore * 10);
    
    document.getElementById("eval-bar").style.height = `${percentage}%`;
}

// --- UI Controls ---
document.getElementById("flipBtn").onclick = () => board.setOrientation(board.getOrientation() === 'w' ? 'b' : 'w');

document.getElementById("resetBtn").onclick = () => {
    game.reset();
    board.setPosition(FEN.start);
    board.removeArrows();
    document.getElementById("eval-bar").style.height = "50%";
    document.getElementById("eval-score").innerText = "0.0";
    startAnalysis();
};

document.getElementById("loadPgnBtn").onclick = () => {
    const pgn = document.getElementById("pgnInput").value;
    const loaded = game.load_pgn(pgn);
    if (loaded) {
        board.setPosition(game.fen());
        updateStatus();
        startAnalysis();
        document.getElementById("moveHistory").innerText = game.pgn();
    } else {
        alert("Invalid PGN!");
    }
};

function updateStatus() {
    let status = '';
    let moveColor = game.turn() === 'b' ? 'Black' : 'White';

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) status += ', ' + moveColor + ' is in check';
    }
    document.getElementById("status").innerText = status;
}

// Start everything
initStockfish();



