import PromptSync from 'prompt-sync';
const prompt = PromptSync();
import * as riddlesApi from './api/riddlesApi.js';
import * as playersApi from './api/playersApi.js';
import Riddle, { MultipleChoiceRiddle } from './classes/Riddle.js';
import Player from './classes/Player.js';

const LEVELS = ["easy", "medium", "hard"];

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
}

async function playGame() {
    const name = prompt("Please enter your name: ").trim();
    if (!name) {
        console.log("Name cannot be empty.");
        return;
    }

    const existingPlayer = await playersApi.findPlayerByName(name);
    const player = new Player(name);
    let savedBest = null;

    if (existingPlayer) {
        player.id = existingPlayer.id;
        savedBest = existingPlayer.lowestTime ?? null;
        if (savedBest !== null) {
            console.log(`\nHi ${existingPlayer.name}! Your previous lowest time was ${savedBest} seconds.`);
        } else {
            console.log(`\nHi ${existingPlayer.name}! You have no recorded time yet.`);
        }
    } else {
        console.log(`\nHi ${name}, it seems you are a new player! Let's get you started.`);
        const createdPlayer = await playersApi.createPlayer(name);
        player.id = createdPlayer.id;
    }

    console.log("\nPlease choose a difficulty:");
    LEVELS.forEach((choice, index) => console.log(`${index + 1}. ${choice}`));
    const selectedLevel = LEVELS[Number(prompt("Your choice: ")) - 1];
    if (!selectedLevel) {
        console.log("Invalid difficulty.");
        return;
    }
    player.updateDifficulty(selectedLevel);

    const allRiddles = await riddlesApi.getAllRiddles();
    const filteredRiddles = shuffle(
        allRiddles.filter(riddle => riddle.level === player.difficulty)
    );

    if (filteredRiddles.length === 0) {
        console.log(`There are no ${player.difficulty} riddles yet.`);
        return;
    }

    console.log(`\nNice to meet you, ${player.name}!`);
    console.log(`There are ${filteredRiddles.length} ${player.difficulty} riddles waiting for you.\n`);

    for (const [index, riddle] of filteredRiddles.entries()) {
        console.log(`--------------------------------`);
        console.log(`Riddle ${index + 1} of ${filteredRiddles.length}: ${riddle.name}`);

        const rid = new Riddle(riddle);
        const time = rid.ask(prompt); // שניות, כולל עונשים
        player.times.push(time);

        console.log(`Riddle ${index + 1} completed!`);
    }

    const total = player.times.reduce((sum, t) => sum + t, 0);
    const totalRounded = Number(total.toFixed(2));

    console.log(`\n=============================`);
    console.log(`  Great job, ${player.name}! Here are your results: `);
    console.log("=============================");
    console.log(`Your time: ${totalRounded} seconds`);

    if (savedBest === null || totalRounded < savedBest) {
        player.lowestTime = totalRounded;
        await playersApi.updatePlayer(player);
        console.log("New record! Time updated.");
    } else {
        console.log(`No new record. Your best is still ${savedBest} seconds.`);
    }

    player.showStats();
}

async function createRiddleFlow() {
    const name = prompt("Enter riddle name: ");
    const taskDescription = prompt("Enter task description: ");
    const correctAnswer = prompt("Enter correct answer: ");
    const level = prompt("Enter difficulty level (easy, medium, hard): ").toLowerCase();
    const timeLimit = parseInt(prompt("Enter time limit in seconds: "), 10);
    const hint = prompt("Enter a hint (optional): ");

    if (!name || !taskDescription || !correctAnswer) {
        console.log("Name, description and answer are required.");
        return;
    }
    if (!LEVELS.includes(level)) {
        console.log("Invalid level.");
        return;
    }

  
    await riddlesApi.createRiddle({
        name,
        taskDescription,
        correctAnswer,
        level,
        timeLimit: Number.isNaN(timeLimit) ? 30 : timeLimit,
        hint,
    });
    console.log("Riddle created.");
}

async function readRiddlesFlow() {
    const riddles = await riddlesApi.getAllRiddles();
    console.log("\nAll Riddles:");
    if (riddles.length === 0) {
        console.log("No riddles yet.");
        return;
    }
    riddles.forEach(riddle => {
        console.log(`${riddle.id}. ${riddle.name} (${riddle.level})`);
    });
}

async function updateRiddleFlow() {
    const id = parseInt(prompt("Enter the ID of the riddle to update: "), 10);
    if (Number.isNaN(id)) {
        console.log("Invalid ID.");
        return;
    }

    const current = await riddlesApi.getRiddleById(id);
    if (!current) {
        console.log("Riddle not found.");
        return;
    }

    console.log("Press Enter to keep the current value.");
    const updated = {
        id,
        name: prompt(`New name (${current.name}): `) || current.name,
        taskDescription: prompt(`New description (${current.taskDescription}): `) || current.taskDescription,
        correctAnswer: prompt(`New answer (${current.correctAnswer}): `) || current.correctAnswer,
        level: prompt(`New level (${current.level}): `) || current.level,
        timeLimit: parseInt(prompt(`New time limit (${current.timeLimit}): `), 10) || current.timeLimit,
        hint: prompt(`New hint (${current.hint ?? ""}): `) || current.hint,
    };

    await riddlesApi.updateRiddle(updated);
    console.log("Riddle updated.");
}

async function deleteRiddleFlow() {
    const id = parseInt(prompt("Enter the ID of the riddle to delete: "), 10);
    if (Number.isNaN(id)) {
        console.log("Invalid ID.");
        return;
    }

    const current = await riddlesApi.getRiddleById(id);
    if (!current) {
        console.log("Riddle not found.");
        return;
    }

    await riddlesApi.deleteRiddle(id);
    console.log("Riddle deleted.");
}

async function leaderboardFlow() {
    const players = await playersApi.getAllPlayers();
    const finishedPlayers = players
        .filter(player => player.lowestTime != null)
        .sort((a, b) => a.lowestTime - b.lowestTime);

    console.log("\n🏆 Leaderboard:");
    if (finishedPlayers.length === 0) {
        console.log("No one has finished a game yet.");
        return;
    }
    finishedPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} - ${player.lowestTime} seconds`);
    });
}

async function mainMenu() {
    console.log("\n=============================");
    console.log("  Welcome to the Riddle Game!  ");
    console.log("=============================");

    while (true) {
        console.log("\nWhat do you want to do?");
        console.log("1. Play the game");
        console.log("2. Create a new riddle");
        console.log("3. Read all riddles");
        console.log("4. Update an existing riddle");
        console.log("5. Delete a riddle");
        console.log("6. View leaderboard");
        console.log("0. Exit");
        const choice = prompt("Choose an option (0-6): ");

        try {
            switch (choice) {
                case "0":
                    console.log("Exiting the game. Goodbye!");
                    return;
                case "1":
                    await playGame();
                    break;
                case "2":
                    await createRiddleFlow();
                    break;
                case "3":
                    await readRiddlesFlow();
                    break;
                case "4":
                    await updateRiddleFlow();
                    break;
                case "5":
                    await deleteRiddleFlow();
                    break;
                case "6":
                    await leaderboardFlow();
                    break;
                default:
                    console.log("Invalid option. Please choose 0-6.");
            }
        } catch (error) {
            console.error("Something went wrong:", error.message);
            console.error("Is the server running? (npm run server)");
        }
    }
}

await mainMenu();