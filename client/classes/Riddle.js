class Riddle {
    constructor(details) {
        this.id = details.id;
        this.name = details.name;
        this.taskDescription = details.taskDescription;
        this.correctAnswer = details.correctAnswer;
        this.level = details.level;
        this.timeLimit = details.timeLimit;
        this.hint = details.hint;
    }

    // מחשב את הזמן הסופי בשניות: זמן בפועל + קנס חריגה + קנס רמזים
    calculateTime(startTime, hintPenalty) {
        const elapsedTime = (Date.now() - startTime) / 1000;
        let timePenalty = 0;

        if (this.timeLimit && elapsedTime > this.timeLimit) {
            timePenalty = elapsedTime - this.timeLimit;
            console.log(`⏱️ Time limit exceeded by ${timePenalty.toFixed(1)} seconds. Penalty applied!`);
        }

        return elapsedTime + timePenalty + hintPenalty;
    }

    ask(prompt) {
        let hintPenalty = 0;

        console.log(`🧩 Riddle: ${this.name}`);
        console.log(`📝 ${this.taskDescription}`);

        const startTime = Date.now();

        while (true) {
            const answer = prompt("👉 Enter your answer (or type 'hint'): ").trim().toLowerCase();

            if (answer === "hint") {
                if (this.hint) {
                    console.log(`💡 Hint: ${this.hint}`);
                    hintPenalty += 10;
                } else {
                    console.log("No hint available.");
                }
            } else if (answer === this.correctAnswer.toLowerCase()) {
                break;
            } else {
                console.log("❌ That answer is not correct. Please try again!");
            }
        }

        console.log("✅ Great job! That is the correct answer!");
        return this.calculateTime(startTime, hintPenalty);
    }
}

class MultipleChoiceRiddle extends Riddle {
    constructor(details) {
        super(details);
        this.choices = details.choices;
    }

    ask(prompt) {
        let hintPenalty = 0;

        console.log(`🧩 Riddle: ${this.name}`);
        console.log(`📝 ${this.taskDescription}`);
        this.choices.forEach((choice, index) => {
            console.log(`${index + 1}. ${choice}`);
        });

        const startTime = Date.now();

        while (true) {
            const input = prompt("👉 Enter your choice (number, or 'hint'): ").trim().toLowerCase();

            if (input === "hint") {
                if (this.hint) {
                    console.log(`💡 Hint: ${this.hint}`);
                    hintPenalty += 10;
                } else {
                    console.log("No hint available.");
                }
                continue;
            }

            const selectedChoice = this.choices[Number(input) - 1];

            if (selectedChoice === undefined) {
                console.log(`Please enter a number between 1 and ${this.choices.length}.`);
            } else if (selectedChoice === this.correctAnswer) {
                break;
            } else {
                console.log("❌ That answer is not correct. Please try again!");
            }
        }

        console.log("✅ Great job! That is the correct answer!");
        return this.calculateTime(startTime, hintPenalty);
    }
}

export default Riddle;
export { MultipleChoiceRiddle };