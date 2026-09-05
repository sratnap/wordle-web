import random
import sys
import uuid
from pathlib import Path

from fastapi import Cookie, FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from scoring import score_guess

NUM_GUESSES = 6

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

try:
    text = Path("words.txt").read_text()
except FileNotFoundError:
    sys.exit("words.txt is missing, it should be in the project folder.")
words = text.split()
games = {}


def check_id(response: Response, session_id: str | None):
    if session_id is None:
        session_id = str(uuid.uuid4())
        response.set_cookie("session_id", session_id)
    return session_id


def start_game(session_id: str):
    answer = random.choice(words)
    games[session_id] = {"answer": answer, "turns": 0, "over": False, "guesses": [], "win": False, "lost": False}


@app.get("/")
def index():
    return FileResponse("static/index.html")


@app.get("/new")
def new_game(response: Response, session_id: str | None = Cookie(default=None)):
    session_id = check_id(response, session_id)
    start_game(session_id)
    return {}


@app.get("/state")
def state(response: Response, session_id: str | None = Cookie(default=None)):
    if session_id is None or session_id not in games:
        return {"guesses": [], "turns": 0, "over": False, "answer": None, "win": False, "lost": False}
    answer = games[session_id]["answer"] if games[session_id]["over"] else None    
    return {"guesses": games[session_id]["guesses"], "turns": games[session_id]["turns"], "over": games[session_id]["over"], "answer": answer, "win": games[session_id]["win"], "lost": games[session_id]["lost"]}


@app.get("/score/{guess}")
def score(guess: str, response: Response, session_id: str | None = Cookie(default=None)):
    if guess not in words:
        raise HTTPException(status_code=400, detail="Not a valid word.")
    session_id = check_id(response, session_id)
    if session_id not in games:
        start_game(session_id)
    if games[session_id]["over"]:
        raise HTTPException(status_code=400, detail="Good game!") 
    feedback = score_guess(guess, games[session_id]["answer"])
    games[session_id]["guesses"].append([guess, feedback])
    games[session_id]["turns"] += 1
    if guess == games[session_id]["answer"]:
        games[session_id]["win"] = True
        games[session_id]["over"] = True
    if games[session_id]["turns"] == NUM_GUESSES and not games[session_id]["win"]:
        games[session_id]["lost"] = True
        games[session_id]["over"] = True
    answer = games[session_id]["answer"] if games[session_id]["over"] else None
    return {"feedback": feedback, "turns": games[session_id]["turns"], "win": games[session_id]["win"], "lost": games[session_id]["lost"], "over": games[session_id]["over"], "answer": answer}


