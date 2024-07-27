class ExerciseService {
    constructor(repo) {
        this.repo = repo;
    }

    async createExercise(username, description, duration, date) {
        return this.repo.createExercise(username, description, duration, date);
    }

    async getLogs(username, limit, from, to) {
        const exercises = await this.repo.getExercises(username, limit, from, to);
        return {
            count: exercises.length,
            log: exercises,
        }
    }

}

module.exports = ExerciseService;