export async function parse() {
    const file = 'data.json';
    const response = await fetch(file);
    const data = await response.json();
    const box = {
        'losing_score': 0,
        'winning_score': 0,
        'count': 0,
        'lastGame': 'n/a',
        'firstGame': 'n/a',
    };

    // Fill empty grid array with new arrays of the same
    // length, then fill those arrays with new box object.
    const cTotal = 77;
    const rTotal = 51;
    const grid = new Array(rTotal * cTotal);
    for (let i = 0; i < grid.length; i++) {
        let c = i % cTotal;
        let r = Math.floor(i / cTotal);
        grid[i] = {...box}; // shoutouts to johnny
        grid[i].winning_score = c;
        grid[i].losing_score = r;

        // Handle exceptions, such as when winning score
        // is less than losing score or other impossible scores.
        if (
            r === 0 && c === 1 ||
            r === 1 && (c >= 1 && c <= 7 && c !== 6)
        ) grid[i].count = -1;

        else if (c < r) grid[i].count = -2;
    
    }

    for (let score in data) {
        let e = data[score];
        let c = e.princeton;
        let r = e.opponent;

        // Swap the rows and columns so the winning team will be on top
        // instead of Princeton, similar to actual Scorigami. May be
        // removed depending on the Sports section's wishes.
        if (e.win === "L") {
            let temp = c;
            c = r;
            r = temp;
        }
		
		// Equation below places the score pair in the correct index in
		// the array based on its row and column number.
        let scorePair = grid[r * cTotal + c];
        scorePair.count++;
        if (scorePair.firstGame === 'n/a') scorePair.firstGame = e.description;
        else scorePair.lastGame = e.description;
        scorePair.losing_score = r;
        scorePair.winning_score = c;
        
    }

    const blob = new Blob([JSON.stringify(grid)], {type: "application/json"});
    return URL.createObjectURL(blob);
}