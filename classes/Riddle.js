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
    constructor(id, name, taskDescription, correctAnswer) {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
    }

    ask(prompt) {
        console.log(`🧩 Riddle: ${this.name}`);
        console.log(`📝 ${this.taskDescription}`);

        let answer = prompt("👉 Enter your answer: ");
        while (answer != this.correctAnswer ) {
            console.log("❌ That answer is not correct. Please try again!");
            answer = prompt("👉 Enter a new answer: ");
        }

        console.log("✅ Great job! That is the correct answer!");
    }
}

export default Riddle;