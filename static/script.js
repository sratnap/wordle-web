const button = document.getElementById("submit");
const newButton = document.getElementById("new");
const input = document.getElementById("guess");
const board = document.getElementById("board");
const output = document.getElementById("output");


async function handleClick() {
    const response = await fetch(`/score/${input.value}`);
    const data = await response.json();
    if (!response.ok) {
        output.textContent = data.detail;
        return;
    }
   
    const row = document.createElement("div");
    row.className = "row";
    const lowerInput = input.value.toLowerCase();
    for (let i = 0; i < lowerInput.length; i++) {
        const tile = document.createElement("div");
        if (data.feedback[i] === "_") {
            tile.className = "tile grey";
        } else if (data.feedback[i] === data.feedback[i].toUpperCase()) {
            tile.className = "tile green";
        } else {
            tile.className = "tile yellow";
        }
        tile.textContent = lowerInput[i];
        row.appendChild(tile);
    }
    board.appendChild(row);

    if (data.win) {
        output.textContent = "Good job!";
    } else if (data.lost) {
        output.textContent = `Nice try! The word was ${data.answer}!`;
    }

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

button.addEventListener("click", handleClick);
newButton.addEventListener("click", handleNew);




