// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
class Player {
    constructor(name) {
        this.name = name;
        this.difficulty = 'easy';
        this.times = [];
        this.lowestTime = null;
    }
    updateDifficulty(newDifficulty) {
        this.difficulty = newDifficulty;
    }
    getLowestTime() {
        return this.lowestTime;
    }

    recordTime(start, end) {
        this.times.push(end - start);
        if (this.lowestTime === null || end - start < this.lowestTime) {
            this.lowestTime = end - start;
        }
    }

    showStats() {
        const total = this.times.reduce((sum, time) => sum + time, 0);
        const average = this.times.length > 0 ? total / this.times.length : 0;

        console.log(`Player: ${this.name}`);
        console.log(`Total time: ${(total).toFixed(2)} seconds`);
        console.log(`Average time per riddle: ${(average ).toFixed(2)} seconds`);
    }
}

export default Player;