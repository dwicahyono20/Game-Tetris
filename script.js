// Game Tetris Logic
function startTetrisGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;

    // Set different colors for each tetromino shape
    const tetrominoColors = [
        '#00F0F0', // I shape (cyan)
        '#00FF00', // S shape (green)
        '#FF0000', // Z shape (red)
        '#FFFF00', // O shape (yellow)
        '#0000FF', // L shape (blue)
        '#FF00FF', // J shape (magenta)
        '#FFA500'  // T shape (orange)
    ];
    
    // Tetromino shapes
    const tetrominos = [
        [[1, 1, 1, 1]], // I shape
        [[1, 1, 0], [0, 1, 1]], // S shape
        [[0, 1, 1], [1, 1, 0]], // Z shape
        [[1, 1], [1, 1]], // O shape
        [[1, 0, 0], [1, 1, 1]], // L shape
        [[0, 0, 1], [1, 1, 1]], // J shape
        [[0, 1, 0], [1, 1, 1]]  // T shape
    ];

    let currentPiece = createRandomPiece();
    let currentPos = { x: Math.floor(COLS / 2) - 1, y: 0 };

    // Update score display
    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    // Draw board
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x] !== 0) {
                    ctx.fillStyle = tetrominoColors[board[y][x] - 1];
                    ctx.shadowColor = '#444'; // Shadow color for 3D effect
                    ctx.shadowBlur = 5;       // Shadow blur for realism
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.shadowBlur = 0; // Reset shadow blur after drawing
                }
            }
        }
    }

    // Draw piece
    function drawPiece() {
        const piece = currentPiece;
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    ctx.fillStyle = tetrominoColors[0]; // Color of current piece
                    ctx.shadowColor = '#444'; // Shadow for 3D effect
                    ctx.shadowBlur = 5;
                    ctx.fillRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.shadowBlur = 0; // Reset shadow blur
                }
            }
        }
    }

    // Collision detection
    function checkCollision() {
        const piece = currentPiece;
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    const newX = currentPos.x + x;
                    const newY = currentPos.y + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Place piece on board
    function placePiece() {
        const piece = currentPiece;
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    board[currentPos.y + y][currentPos.x + x] = currentPiece.colorIndex + 1;
                }
            }
        }
        currentPiece = createRandomPiece();
        currentPos = { x: Math.floor(COLS / 2) - 1, y: 0 };
        checkLines();
    }

    // Move piece down
    function movePieceDown() {
        currentPos.y++;
        if (checkCollision()) {
            currentPos.y--;
            placePiece();
        }
    }

    // Check and clear full lines
    function checkLines() {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                score += 100; // Add score for clearing line
                updateScore();
            }
        }
    }

    // Handle keyboard inputs
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            movePieceDown();
        } else if (e.key === 'ArrowLeft') {
            currentPos.x--;
            if (checkCollision()) {
                currentPos.x++;
            }
        } else if (e.key === 'ArrowRight') {
            currentPos.x++;
            if (checkCollision()) {
                currentPos.x--;
            }
        } else if (e.key === 'ArrowUp') {
            currentPiece = rotatePiece(currentPiece);
            if (checkCollision()) {
                currentPiece = rotatePiece(currentPiece, true);
            }
        }
    });

    // Rotate piece
    function rotatePiece(piece, reverse = false) {
        return piece[0].map((_, index) => piece.map(row => row[index])).reverse();
    }

    // Create random piece and assign color index
    function createRandomPiece() {
        const index = Math.floor(Math.random() * tetrominos.length);
        const piece = tetrominos[index];
        piece.colorIndex = index; // Assign a color index based on tetromino type
        return piece;
    }

    // Game loop
    function gameLoop() {
        drawBoard();
        drawPiece();
        movePieceDown();
        setTimeout(gameLoop, 500);
    }

    gameLoop();
}

// Start the game when the page loads
window.onload = startTetrisGame;
