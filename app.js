const boxes = document.querySelectorAll(".box");
const reset = document.querySelector("#reset");
const result = document.querySelector(".result");

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

// Handle Box Click
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!gameOver) {
            box.innerText = turno ? "O" : "X";
            box.disabled = true;
            checkWinner();
            turno = !turno; // Switch turns
        }
    });
});

// Check for Winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            boxes[a].innerText !== "" &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[a].innerText === boxes[c].innerText
        ) {
            gameOver = true;
            result.innerText = `Winner: ${boxes[a].innerText}`;
            highlightWinner(pattern);
            return;
        }
    }

    // Check for Draw
    if ([...boxes].every((box) => box.innerText !== "")) {
        gameOver = true;
        result.innerText = "It's a Draw!";
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
    turno = true;
    gameOver = false;
});
