from fastapi import FastAPI
from scoring import score_guess

app = FastAPI()
answer = "crane"


@app.get("/score/{guess}")
def score(guess: str):
    return {"feedback": score_guess(guess, answer)}
