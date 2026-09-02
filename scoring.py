def score_guess(guess, answer):
    ans_counts = {}
    for letter in answer:
        ans_counts[letter] = ans_counts.get(letter, 0) + 1
    
    feedback = ""
    # Marks ONLY greens
    results = {}
    for pos in range(len(answer)):
        if answer[pos] == guess[pos]:
            results[pos] = guess[pos].upper()
            ans_counts[guess[pos]] -= 1

    # Finishes results dict
    for pos in range(len(answer)):
        if pos in results:
            continue
        if ans_counts.get(guess[pos], 0) > 0: 
            results[pos] = guess[pos].lower()
            ans_counts[guess[pos]] -= 1
        else:
            results[pos] = "_"
                
    for pos in range(len(answer)):
        feedback += results[pos]
    return feedback