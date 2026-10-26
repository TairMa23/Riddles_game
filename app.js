// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import PromptSync from 'prompt-sync';
const prompt = PromptSync();

import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';
import riddles from './riddles/index.js';


console.log("\n=============================");
console.log("  Welcome to the Riddle Game!  ");
console.log("=============================");

const name = prompt("Please enter your name: ");
const player = new Player(name || "Player");

console.log(`\nNice to meet you, ${player.name}!`);
console.log(`There are ${riddles.length} riddles waiting for you.\n`);

riddles.forEach((riddle, index) => {
    console.log(`--------------------------------`);
    console.log(`Riddle ${index + 1} of ${riddles.length}: ${riddle.name}`);

    const startTime = Date.now();

    const rid = new Riddle(
        riddle.id,
        riddle.name,
        riddle.taskDescription,
        riddle.correctAnswer
    );
    rid.ask(prompt);

    const endTime = Date.now();
    player.recordTime(startTime, endTime);

    console.log(`Riddle ${index + 1} completed!`);
});

console.log(`\n=============================`);
console.log("  Great job! Here are your results: ");
console.log("=============================");
player.showStats();
