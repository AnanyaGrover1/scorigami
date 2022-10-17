const fs = require('fs');
const json = fs.readFileSync('data.json');
const data = JSON.parse(json.toString());
const box = {'count': 0, 'lastGame': 'n/a', 'firstGame': 'n/a'};

// Fill the empty grid array with new arrays of the same
// length, then fill those arrays with a new object based
// on the prototype above. Length of these arrays may
// be changed based on the Sports section's discretion.
let grid = new Array(76);
for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(grid.length);
    for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = Object.create(box);
    }
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

    let scorePair = grid[r][c];
    scorePair.count++;
    if (scorePair.firstGame === 'n/a') scorePair.firstGame = e.description;
    else scorePair.lastGame = e.description;
}

console.log(grid);