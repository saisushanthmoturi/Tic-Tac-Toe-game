const boxes = document.querySelectorAll(".box");
const reset = document.querySelector("#reset");
const result = document.querySelector(".result");
const chatbotIcon = document.querySelector("#chatbot-icon");
const chatbot = document.querySelector("#chatbot");
const chatContent = document.querySelector("#chat-content");
const chatInput = document.querySelector("#chat-input");
const sendChat = document.querySelector("#send-chat");
const closeChat = document.querySelector("#close-chat");

let turno = true; // True for 'O', False for 'X'
let gameOver = false;

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Open and Close Chatbot
chatbotIcon.addEventListener("click", () => {
    chatbot.classList.add("open");
    chatbotIcon.style.display = "none";
});

closeChat.addEventListener("click", () => {
    chatbot.classList.remove("open");
    chatbotIcon.style.display = "flex";
});

// Chatbot Response
const chatbotResponse = (message) => {
    const chatMessage = document.createElement("p");
    chatMessage.innerText = message;
    chatContent.appendChild(chatMessage);
    chatContent.scrollTop = chatContent.scrollHeight;
};

// Handle Chatbot Messages
sendChat.addEventListener("click", () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatbotResponse(`You: ${userMessage}`);

    if (userMessage.toLowerCase().includes("tips")) {
        chatbotResponse("Bot: Try to take the center position if it's available!");
    } else if (userMessage.toLowerCase().includes("rules")) {
        chatbotResponse("Bot: Players take turns marking a box. First to get 3 in a row wins!");
    } else if (userMessage.toLowerCase().includes("hello")) {
        chatbotResponse("Bot: Hello! How can I assist you today?");
    } else {
        chatbotResponse("Bot: I'm here to assist you with the game. Ask me anything!");
    }
    chatInput.value = "";
});

// Handle Box Click
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameOver) {
            box.innerText = turno ? "O" : "X";
            box.disabled = true;
            chatbotResponse(`Player ${turno ? "O" : "X"} made a move!`);
            checkWinner();
            turno = !turno;
        }
    });
});

// Check for Winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[a].innerText === boxes[c].innerText
        ) {
            gameOver = true;
            result.innerText = `Winner: ${boxes[a].innerText}`;
            chatbotResponse(`Bot: Congratulations Player ${boxes[a].innerText}! You won!`);
            highlightWinner(pattern);
            return;
        }
    }

    // Check for Draw
    if ([...boxes].every((box) => box.innerText !== "")) {
        gameOver = true;
        result.innerText = "It's a Draw!";
        chatbotResponse("Bot: The game ended in a draw. Well played!");
    }
};

// Highlight Winning Pattern
const highlightWinner = (pattern) => {
    pattern.forEach((index) => {
        boxes[index].style.backgroundColor = "#55efc4";
    });
};

// Reset Game
reset.addEventListener("click", () => {
    boxes.forEach((box) => {
        box.innerText = "";
        box.style.backgroundColor = "#dfe6e9";
        box.disabled = false;
    });
    result.innerText = "";
    chatContent.innerHTML = "<p>Welcome! Ask me for tips, rules, or say hello!</p>";
    turno = true;
    gameOver = false;
});
