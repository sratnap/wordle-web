from fastapi import FastAPI, HTTPException
from scoring import score_guess
from pathlib import Path
import sys
# import random

app = FastAPI()

try:
    text = Path("words.txt").read_text()
except FileNotFoundError:
    sys.exit("words.txt is missing, it should be in the project folder.")
words = text.split()
# answer = random.choice(words)
answer = "crane"


@app.get("/score/{guess}")
def score(guess: str):
    if guess not in words:
        raise HTTPException(status_code=400, detail="Not a valid word.")
    return {"feedback": score_guess(guess, answer)}
