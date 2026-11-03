import PromptSync from 'prompt-sync';
const prompt = PromptSync();
import * as  riddlesApi from './api/riddlesApi.js';
import * as  playersApi from './api/playersApi.js';
import Riddle from './classes/Riddle.js';
import Player from './classes/Player.js';

const riddles = await riddlesApi.getAllRiddles();
function shuffle(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}
async function playGame() {
    const randomizedRiddles = shuffle(riddles);

    const name = prompt("Please enter your name: ");
    const existingPlayer = await playersApi.findPlayerByName(name);
    const player = new Player(name);
    if (existingPlayer) {
        console.log(`\nHi ${existingPlayer.name}  Your previous lowest time was ${existingPlayer.lowestTime} seconds.`);
        player.id = existingPlayer.id;
    }
    else {
        console.log(`\nHi ${name}, it seems you are a new player! Let's get you started.`);

        const createdPlayer = await playersApi.createPlayer(name);
        console.log("Created player:", createdPlayer);
        player.id = createdPlayer.id;
    }
    console.log("Please Choose a difficulty: ");
    const levels = ["easy", "medium", "hard"];
    levels.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
    });
    let difficulty = prompt();

    let selectedChoice = levels[Number(difficulty) - 1];

    player.updateDifficulty(selectedChoice);
    await playersApi.updatePlayer(player);
    console.log(`\nNice to meet you, ${player.name}!`);
    const filteredRiddles = randomizedRiddles.filter(
        riddle => riddle.level === player.difficulty
    );
    console.log(`There are ${filteredRiddles.length} ${player.difficulty} riddles waiting for you.\n`);
    filteredRiddles.forEach((riddle, index) => {
        console.log(`--------------------------------`);
        console.log(`Riddle ${index + 1} of ${filteredRiddles.length}: ${riddle.name}`);

        const startTime = Date.now() / 1000;

        const rid = new Riddle(riddle);
        rid.ask(prompt);

        const endTime = Date.now() / 1000;
        player.recordTime(startTime, endTime);

        console.log(`Riddle ${index + 1} completed!`);
    });

    console.log(`\n=============================`);
    console.log("  Great job! Here are your results: ");
    console.log("=============================");
    player.showStats();

}
async function mainMenu() {
    console.log("\n=============================");
    console.log("  Welcome to the Riddle Game!  ");
    console.log("=============================");
    console.log("\nWhat do you want to do?");
    console.log("1. Play the game");
    console.log("2. Create a new riddle");
    console.log("3. Read all riddles");
    console.log("4. Update an existing riddle");
    console.log("5. Delete a riddle");
    console.log("6. View leaderboard");
    const choice = prompt("Choose an option (1-6): ");
    switch (choice) {
        case "0":
            console.log("Exiting the game. Goodbye!");
            process.exit(0);
        case "1":
            playGame();
            break;
        case "2":
            riddlesApi.createRiddle({
                id: riddlesApi.getAllRiddles().length + 1,
                name: prompt("Enter riddle name: "),
                taskDescription: prompt("Enter task description: "),
                correctAnswer: prompt("Enter correct answer: "),
                level: prompt("Enter difficulty level (easy, medium, hard): "),
                timeLimit: parseInt(prompt("Enter time limit in seconds: "), 10),
                hint: prompt("Enter a hint (optional): "),
            });
            break;
        case "3":
            riddlesApi.getAllRiddles().then(riddles => {
                console.log("\nAll Riddles:");
                riddles.forEach(riddle => {
                    console.log(`- ${riddle.name} (${riddle.level})`);
                });
            });
            break;
        case "4":
            const riddleIdToUpdate = parseInt(prompt("Enter the ID of the riddle to update: "), 10);
            riddlesApi.updateRiddle({
                id: riddleIdToUpdate,
                name: prompt("Enter new riddle name: "),
                taskDescription: prompt("Enter new task description: "),
                correctAnswer: prompt("Enter new correct answer: "),
                level: prompt("Enter new difficulty level (easy, medium, hard): "),
                timeLimit: parseInt(prompt("Enter new time limit in seconds: "), 10),
                hint: prompt("Enter new hint (optional): "),
            });
            break;
        case "5":
            const riddleIdToDelete = parseInt(prompt("Enter the ID of the riddle to delete: "), 10);
            riddlesApi.deleteRiddle(riddleIdToDelete);
            break;
        case "6":
            const players = await playersApi.getAllPlayers();
            console.log("\n🏆Leaderboard:");
            const finishedPlayers = players.filter(player => player.lowestTime !== null);
            finishedPlayers.sort((a, b) => a.lowestTime - b.lowestTime);
            finishedPlayers.forEach((player, index) => {
                console.log(`${index + 1}. ${player.name} — ${player.lowestTime} seconds`);
            });
            break;
        default:
            return null;
    }
}

mainMenu();
