export async function parse() {
    let file = 'data.json';
    let response = await fetch(file);
    let data = await response.json();
    const box = {'losing_score': 0, 'winning_score': 0, 'count': 0, 'lastGame': 'n/a', 'firstGame': 'n/a'};

    // Fill the empty grid array with new arrays of the same
    // length, then fill those arrays with a new object based
    // on the prototype above. Length of these arrays may
    // be changed based on the Sports section's discretion.
    let grid = new Array(5776);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = Object.create(box);
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

        let scorePair = grid[r * 76 + c];
        scorePair.count++;
        if (scorePair.firstGame === 'n/a') scorePair.firstGame = e.description;
        else scorePair.lastGame = e.description;
        scorePair.losing_score = r;
        scorePair.winning_score = c;
        
    }

    const blob = new Blob([JSON.stringify(grid)], {type: "application/json"});
    return URL.createObjectURL(blob);
    // Promise.resolve(URL.createObjectURL(blob)).then((value) => {
    //     console.log(value);
    //     blobURL = value;
    // });
}