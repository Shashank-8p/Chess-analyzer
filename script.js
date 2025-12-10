// --- Global Variables ---
var board = null;
var game = new Chess();
var $status = $('#status');
var $bestMove = $('#bestMove');
var $depth = $('#depth');
var stockfish = null;
var isEngineReady = false;

// --- Stockfish Integration (The Blob Method) ---
function initStockfish() {
    // We load Stockfish as a Blob to avoid CORS on the worker itself
    var stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
    
    fetch(stockfishUrl).then(response => response.blob()).then(blob => {
        var objectURL = URL.createObjectURL(blob);
        stockfish = new Worker(objectURL);

        stockfish.onmessage = function(event) {
            var line = event.data;

            // 1. Detect Best Move
            if (line.startsWith("bestmove")) {
                var bestMove = line.split(" ")[1];
                if(bestMove && bestMove !== '(none)') {
                    $bestMove.text(bestMove);
                    highlightBestMove(bestMove);
                }
            }

            // 2. Detect Eval
            if (line.includes("score cp") || line.includes("score mate")) {
                parseEvaluation(line);
            }
            
            // 3. Depth
            if (line.includes("depth")) {
                var depth = line.match(/depth\s+(\d+)/);
                if(depth) $depth.text(depth[1]);
            }
        };

        stockfish.postMessage("uci");
        isEngineReady = true;
        $status.text("Engine Ready! White to Move.");
    });
}

// --- Analysis Functions ---
function startAnalysis() {
    if (!stockfish || !isEngineReady) return;
    stockfish.postMessage("stop");
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 15"); // Depth 15 is fast and decent
}

function parseEvaluation(line) {
    var score = 0.0;
    if (line.includes("mate")) {
        var mateMatch = line.match(/score mate (-?\d+)/);
        score = mateMatch[1] > 0 ? 100 : -100;
        $('#eval-score').text('M' + Math.abs(mateMatch[1]));
    } else {
        var cpMatch = line.match(/score cp (-?\d+)/);
        if (cpMatch) {
            score = parseInt(cpMatch[1]) / 100;
            if (game.turn() === 'b') score = -score;
            var sign = score > 0 ? "+" : "";
            $('#eval-score').text(sign + score);
        }
    }
    
    // Update Bar Height
    var clamped = Math.max(-5, Math.min(5, score));
    var percent = 50 + (clamped * 10);
    $('#eval-bar').css('height', percent + '%');
}

// --- Visual Board Logic (Chessboard.js) ---
function onDragStart (source, piece) {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
    // Clear old highlights and start analysis
    $('.square-55d63').removeClass('highlight-best');
    setTimeout(startAnalysis, 200);
}

function onSnapEnd () {
    board.position(game.fen());
}

function updateStatus() {
    var status = '';
    var moveColor = 'White';
    if (game.turn() === 'b') moveColor = 'Black';

    if (game.in_checkmate()) status = 'Game over, ' + moveColor + ' is in checkmate.';
    else if (game.in_draw()) status = 'Game over, drawn position';
    else {
        status = moveColor + ' to move';
        if (game.in_check()) status += ', ' + moveColor + ' is in check';
    }
    $status.text(status);
}

// Highlight the Best Move squares in RED
function highlightBestMove(bestMove) {
    // Remove old highlights
    $('.square-55d63').removeClass('highlight-best');

    // Parse 'e2e4' into 'e2' and 'e4'
    var source = bestMove.substring(0, 2);
    var target = bestMove.substring(2, 4);

    // Add highlight class using chessboard.js selectors
    $('.square-' + source).addClass('highlight-best');
    $('.square-' + target).addClass('highlight-best');
}

// --- Initialization ---
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = Chessboard('myBoard', config);
initStockfish();

// --- Button Listeners ---
$('#flipBtn').on('click', board.flip);
$('#startBtn').on('click', function() {
    game.reset();
    board.start();
    $('.square-55d63').removeClass('highlight-best');
    startAnalysis();
});
$('#loadPgnBtn').on('click', function() {
    var pgn = $('#pgnInput').val();
    if(game.load_pgn(pgn)) {
        board.position(game.fen());
        updateStatus();
        startAnalysis();
    } else {
        alert("Invalid PGN");
    }
});