require('dotenv').config();
const UserService = require('./src/user/service');
const UserRepo = require('./src/user/repository/mongo')
const ExerciseService = require('./src/exercise/service');
const ExerciseRepository = require('./src/exercise/repository/mongo');
const createApp = require('./src/app');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB, {authSource: "admin"})
    .then(() => {
        const userRepo = new UserRepo();
        const userService = new UserService(userRepo);

        const exerciseRepo = new ExerciseRepository();
        const exerciseService = new ExerciseService(exerciseRepo);
        const app = createApp(userService, exerciseService);

        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log('Your app is listening on port ' + listener.address().port);
        });
    })
    .catch((err) => {
        console.error(err);
    });
