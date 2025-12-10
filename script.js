// --- FIXED IMPORTS (Using esm.sh for better browser support) ---
import { Chessboard, FEN } from "https://esm.sh/cm-chessboard@8/src/cm-chessboard/Chessboard.js";
import { ARROW_TYPE, Arrows } from "https://esm.sh/cm-chessboard@8/src/cm-chessboard/extensions/arrows/Arrows.js";
import { MARKERS, Markers } from "https://esm.sh/cm-chessboard@8/src/cm-chessboard/extensions/markers/Markers.js";

// --- Game State ---
const game = new Chess();
let board = null;
let stockfish = null;
let isEngineReady = false;

// --- Initialize Board ---
board = new Chessboard(document.getElementById("board"), {
    position: FEN.start,
    // FIXED: Points to a reliable source for the piece images (SVG)
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8/assets/",
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
            const move = game.move({
                from: event.squareFrom,
                to: event.squareTo,
                promotion: 'q'
            });

            if (move) {
                event.chessboard.setPosition(game.fen());
                updateStatus();
                startAnalysis(); 
                return true;
            } else {
                return false; 
            }
    }
});

// --- Stockfish Engine Integration ---
function initStockfish() {
    const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
    
    fetch(stockfishUrl).then(response => response.blob()).then(blob => {
        const objectURL = URL.createObjectURL(blob);
        stockfish = new Worker(objectURL);

        stockfish.onmessage = function(event) {
            const line = event.data;
            
            if (line.startsWith("bestmove")) {
                const bestMove = line.split(" ")[1];
                document.getElementById("bestMove").innerText = bestMove;
                
                // Draw arrow for best move
                const from = bestMove.substring(0, 2);
                const to = bestMove.substring(2, 4);
                
                board.removeArrows(); 
                board.addArrow(ARROW_TYPE.danger, from, to);
            }

            if (line.includes("score cp") || line.includes("score mate")) {
                parseEvaluation(line);
            }
            
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
    stockfish.postMessage("go depth 15");
}

function parseEvaluation(line) {
    let score = 0.0;
    
    if (line.includes("mate")) {
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (mateMatch) {
            score = mateMatch[1] > 0 ? 100 : -100;
            document.getElementById("eval-score").innerText = `M${Math.abs(mateMatch[1])}`;
        }
    } 
    else {
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (cpMatch) {
            score = parseInt(cpMatch[1]) / 100;
            if (game.turn() === 'b') score = -score;
            document.getElementById("eval-score").innerText = score > 0 ? `+${score}` : score;
        }
    }
    updateEvalBar(score);
}

function updateEvalBar(score) {
    const clampedScore = Math.max(-5, Math.min(5, score));
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

initStockfish();