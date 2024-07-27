const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    duration: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    }
});

const Exercise = mongoose.model('exercises', ExerciseSchema);
const toModel = (exercise) => {
    if (!exercise) {
        return null
    }
    return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
    }
}

class ExerciseRepository {

    async createExercise(username, description, duration, date) {
        const exercise = new Exercise({username, description, duration, date});
        const result = await exercise.save();
        return toModel(result);
    }

    async getExercises(username, limit, from, to) {
        const query = Exercise.find({username});
        if (from) {
            query.find({date: {$gte: new Date(from)}});
        }
        if (to) {
            query.find({date: {$lte: new Date(to)}});
        }
        if (limit) {
            console.log('limit');
            query.limit(limit);
        }
        const results = await query.exec();
        return results.map(toModel);
    }
}

module.exports = ExerciseRepository;