import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from scoring import score_guess

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

try:
    text = Path("words.txt").read_text()
except FileNotFoundError:
    sys.exit("words.txt is missing, it should be in the project folder.")
words = text.split()
answer = "crane"


@app.get("/")
def index():
    return FileResponse("static/index.html")

@app.get("/score/{guess}")
def score(guess: str):
    if guess not in words:
        raise HTTPException(status_code=400, detail="Not a valid word.")
    return {"feedback": score_guess(guess, answer)}
