const button = document.getElementById("submit");
const newButton = document.getElementById("new");
const input = document.getElementById("guess");
const board = document.getElementById("board");
const output = document.getElementById("output");
const keyboard = document.getElementById("keyboard");
const WORD_LENGTH = 5;
const RANKS = {"green": 3, "yellow": 2, "grey": 1}
const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function buildRow(guess, feedback) {
    const row = document.createElement("div");
    row.className = "row";
    for (let i = 0; i < guess.length; i++) {
        const tile = document.createElement("div");
        if (feedback[i] === "_") {
            tile.className = "tile grey";
        } else if (feedback[i] === feedback[i].toUpperCase()) {
            tile.className = "tile green";
        } else {
            tile.className = "tile yellow";
        }
        tile.textContent = guess[i];
        row.appendChild(tile);
    }
    return row;
}

function renderKeyboard(charColors) {
    keyboard.innerHTML = "";
    for (const keyString of KEYBOARD_ROWS) {
        const keyRow = document.createElement("div");
        keyRow.className = "key-row";
        for (let i = 0; i < keyString.length; i++) {
            const key = document.createElement("div");            
            const letter = keyString[i];
            const status = charColors[letter];
            key.className = status ? `${status} key` : "key";
            key.textContent = letter;
            keyRow.appendChild(key);
        }
        keyboard.appendChild(keyRow);  
    }
}

async function handleClick() {
    output.textContent = "";
    const response = await fetch(`/score/${input.value}`);
    const data = await response.json();
    if (!response.ok) {
        output.textContent = data.detail;
        return;
    }
   
    const guess = input.value.toLowerCase();
    const feedback = data.feedback;
    const guesses = data.guesses;
    board.appendChild(buildRow(guess, feedback));
    input.value = "";
    renderKeyboard(letterStatuses(guesses));
    showOutcome(data.win, data.lost, data.answer);
}

async function handleNew() {
    const response = await fetch("/new");
    const data = await response.json();
    if (!response.ok) {
        output.textContent = data.detail;
        return;
    }
    board.innerHTML = "";
    output.textContent = "";
    renderKeyboard({});
}

function showOutcome(win, lost, answer) {
    if (win) {
        output.textContent = "Good job!";
    }
    else if (lost) {
        output.textContent = `Nice try! The word was ${answer}!`;
    }
}


async function buildBoard() {
    const response = await fetch("/state");
    const data = await response.json();
    for (let i = 0; i < data.guesses.length; i++) {
        const guess = data.guesses[i][0];
        const feedback = data.guesses[i][1];
        board.appendChild(buildRow(guess, feedback));
    }
    renderKeyboard(letterStatuses(data.guesses));
    showOutcome(data.win, data.lost, data.answer);
}

function letterStatuses(guesses) {
    const charColors = {};
    for (const row of guesses) {
        for (let pos = 0; pos < WORD_LENGTH; pos++) {
            const letter = row[0][pos];
            const status = row[1][pos];
            let newStatus;
            if (status === "_") {
                newStatus = "grey";
            }
            else if (status === status.toUpperCase()) {
                newStatus = "green";
            }
            else {
                newStatus = "yellow";
            }
            const current = charColors[letter];
            if (RANKS[newStatus] > (RANKS[current] || 0)) {
                charColors[letter] = newStatus;
            }
        }
    }
    return charColors;
}

button.addEventListener("click", handleClick);
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleClick();
    }
});
newButton.addEventListener("click", handleNew);

buildBoard();
