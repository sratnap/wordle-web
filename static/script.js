const button = document.getElementById("submit");
const input = document.getElementById("guess");
const output = document.getElementById("output");

async function handleClick() {
    const response = await fetch(`/score/${input.value}`);
    const data = await response.json();
    if (!response.ok) {
        output.textContent = data.detail;
        return;
    }

    output.textContent = data.feedback;
}
button.addEventListener("click", handleClick);
