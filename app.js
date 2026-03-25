// DOM Elements
const cells = document.querySelectorAll('.cell');
const boardElement = document.getElementById('board');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const playerXIndicator = document.getElementById('player-x');
const playerOIndicator = document.getElementById('player-o');
const resetBtn = document.getElementById('reset-btn');
const menuBtn = document.getElementById('menu-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

const menuOverlay = document.getElementById('menu-overlay');
const resultOverlay = document.getElementById('result-overlay');
const resultText = document.getElementById('result-text');
const winnerSymbol = document.getElementById('winner-symbol');
const modeBtns = document.querySelectorAll('.mode-btn');

const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');

// Game State
let board = Array(9).fill(null);
let currentPlayer = 'X'; 
let gameActive = false;
let gameMode = 'pvp'; 
let scores = { X: 0, O: 0 };
let isThinking = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize
function initGame(mode) {
    gameMode = mode;
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    isThinking = false;
    
    cells.forEach(cell => {
        cell.innerText = '';
        cell.className = 'cell';
    });
    
    updateIndicators();
    menuOverlay.classList.remove('active');
    resultOverlay.classList.remove('active');
    
    addBotMessage(`Mode: ${mode.toUpperCase()}. Have fun!`);
    
    if (gameMode !== 'pvp') {
        playerOIndicator.querySelector('.name').innerText = 'AI BOT';
    } else {
        playerOIndicator.querySelector('.name').innerText = 'Player 2';
    }
}

// Handle Cell Click
function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] || !gameActive || isThinking) return;
    
    // In PVE mode, force user to be 'X'
    const playerToken = (gameMode === 'pvp') ? currentPlayer : 'X';
    makeMove(index, playerToken);
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player === 'X' ? '×' : '○';
    cells[index].classList.add('taken', player.toLowerCase());
    
    if (checkWin(player)) {
        endGame(player);
    } else if (board.every(cell => cell !== null)) {
        endGame('draw');
    } else {
        // Switch turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateIndicators();
        
        // Handle AI Turn
        if (gameMode !== 'pvp' && currentPlayer === 'O' && gameActive) {
            isThinking = true;
            setTimeout(aiMove, 600);
        } else {
            isThinking = false;
        }
    }
}

function updateIndicators() {
    if (currentPlayer === 'X') {
        playerXIndicator.classList.add('active');
        playerOIndicator.classList.remove('active');
    } else {
        playerOIndicator.classList.add('active');
        playerXIndicator.classList.remove('active');
    }
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function endGame(result) {
    gameActive = false;
    isThinking = false;
    setTimeout(() => {
        resultOverlay.classList.add('active');
        if (result === 'draw') {
            resultText.innerText = "IT'S A DRAW!";
            winnerSymbol.innerText = "🤝";
            winnerSymbol.style.color = "var(--text-secondary)";
            addBotMessage("It's a draw!");
        } else {
            resultText.innerText = result === 'X' ? "PLAYER 1 WINS!" : (gameMode === 'pvp' ? "PLAYER 2 WINS!" : "AI WINS!");
            winnerSymbol.innerText = result === 'X' ? "×" : "○";
            winnerSymbol.style.color = result === 'X' ? "var(--player-x-color)" : "var(--player-o-color)";
            scores[result]++;
            updateScores();
            addBotMessage(result === 'X' ? "Nice move, Player X!" : "AI takes the victory!");
        }
    }, 600);
}

function updateScores() {
    scoreXElement.innerText = scores.X;
    scoreOElement.innerText = scores.O;
}

// AI Logic
function aiMove() {
    if (!gameActive) {
        isThinking = false;
        return;
    }
    
    const moveIndex = gameMode === 'pve-easy' ? getRandomMove() : getBestMove();
    makeMove(moveIndex, 'O');
}

function getRandomMove() {
    const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Minimax Algorithm for Hard Mode
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scoresMap = { O: 10, X: -10, draw: 0 };

function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return scoresMap.O - depth;
    if (checkWin('X')) return scoresMap.X + depth;
    if (board.every(cell => cell !== null)) return scoresMap.draw;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Chatbot Functionality
function addChatMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="text">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
    setTimeout(() => {
        addChatMessage(text, 'bot');
        const count = document.querySelector('.msg-count');
        if (count) count.innerText = parseInt(count.innerText) + 1;
    }, 300);
}

function handleChatSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addChatMessage(text, 'user');
    chatInput.value = '';
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('tip') || lowerText.includes('help')) {
        addBotMessage("Control the center and corners to dominate the board!");
    } else if (lowerText.includes('hard')) {
        addBotMessage("In hard mode, I calculate every possible outcome. Try to draw!");
    } else {
        addBotMessage("Interesting point! Now, focus on your next move.");
    }
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        initGame(mode);
    });
});

resetBtn.addEventListener('click', () => initGame(gameMode));
playAgainBtn.addEventListener('click', () => initGame(gameMode));
menuBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
backToMenuBtn.addEventListener('click', () => {
    resultOverlay.classList.remove('active');
    menuOverlay.classList.add('active');
});

chatbotTrigger.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    const count = document.querySelector('.msg-count');
    if (count) count.innerText = '0';
});

closeChat.addEventListener('click', () => chatbotWindow.classList.remove('active'));
sendChat.addEventListener('click', handleChatSubmit);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
});

window.onload = () => {
    menuOverlay.classList.add('active');
};
