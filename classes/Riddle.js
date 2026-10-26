// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct
class Riddle {
    constructor(details) {
        this.id = details.id;
        this.name = details.name;
        this.taskDescription = details.taskDescription;
        this.correctAnswer = details.correctAnswer;
        this.level = details.level;
        this.timeLimit = details.timeLimit;
    }

    ask(prompt) {
        let late = false;
        console.log(`🧩 Riddle: ${this.name}`);
        console.log(`📝 ${this.taskDescription}`);
        const startTime = Date.now();
        let answer = prompt("👉 Enter your answer: ");
        while (answer != this.correctAnswer) {
            console.log("❌ That answer is not correct. Please try again!");
            answer = prompt("👉 Enter a new answer: ");
            const elapsedTime = (Date.now() - startTime) / 1000;
            if (late==false && elapsedTime > this.timeLimit) {
                late = true;
                const timePenalty = elapsedTime - this.timeLimit;
                console.log(`⏱️ Time limit exceeded by ${timePenalty.toFixed(1)} seconds. Penalty applied!`);
                return elapsedTime + timePenalty;
            }
        }

        console.log("✅ Great job! That is the correct answer!");

        const elapsedTime = (Date.now() - startTime) / 1000;
        if (late==false &&  elapsedTime > this.timeLimit) {
            const timePenalty = elapsedTime - this.timeLimit;
            console.log(`⏱️ Time limit exceeded by ${timePenalty.toFixed(1)} seconds. Penalty applied!`);
            return elapsedTime + timePenalty;
        }

        return elapsedTime;
    }
}

export default Riddle;

class MultipleChoiceRiddle extends Riddle {
    constructor(details) {
        super(details);
        this.choices = details.choices;
    }
    ask(prompt) {
        // Show choices and handle input
        console.log(`🧩 Riddle: ${this.name}`);
        console.log(`📝 ${this.taskDescription}`);
        this.choices.forEach((choice, index) => {
            console.log(`${index + 1}. ${choice}`);
        });

        let answer = prompt("👉 Enter your choice: ");
        let selectedChoice = this.choices[Number(answer) - 1];

        while (selectedChoice !== this.correctAnswer) {
            console.log("❌ That answer is not correct. Please try again!");
            selectedChoice = prompt("👉 Enter a new answer: ");
            let selectedChoice = this.choices[Number(answer) - 1];
        }

        console.log("✅ Great job! That is the correct answer!");

    }
}
export { MultipleChoiceRiddle };
