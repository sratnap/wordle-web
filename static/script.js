const button = document.getElementById("submit");
const newButton = document.getElementById("new");
const input = document.getElementById("guess");
const board = document.getElementById("board");
const output = document.getElementById("output");


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
    board.appendChild(buildRow(guess, feedback));

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
    showOutcome(data.win, data.lost, data.answer);
}

button.addEventListener("click", handleClick);
newButton.addEventListener("click", handleNew);

buildBoard();
