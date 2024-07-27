const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {body, validationResult} = require('express-validator');

function createApp(userService, exerciseService) {
    const app = express();
    app.use(cors());
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', (req, res) => {
        res.sendFile(process.cwd() + '/views/index.html');
    });

    const userRouter = express.Router();
    userRouter.post('/', async (req, res) => {
        try {
            const user = await userService.createUser(req.body.username);
            res
                .status(201)
                .json(user);
        } catch (err) {
            res
                .status(409)
                .json({error: err.toString()});
        }
    });

    userRouter.get('/', async function (req, res) {
        const users = await userService.all();
        res.json(users);
    });

    const exerciseRouter = express.Router({mergeParams: true});
    exerciseRouter.post('/', [
        body('description').notEmpty().isString(),
        body('duration').isInt(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {
            description,
            duration,
        } = req.body;
        let date = Date.now();
        if (req.body.date) {
            date = Date.parse(req.body.date);
        }
        if (isNaN(date)) {
            res.status(400).json({'error': 'invalid date format'});
            return
        }

        try {
            const exercise = await exerciseService.createExercise(req.user.username, description, duration, date);
            res.json({...req.user, ...exercise});
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });

    const logsRouter = express.Router({mergeParams: true});
    logsRouter.get('/', async (req, res) => {
        const {
            limit,
            from,
            to
        } = req.query;
        console.log('limit', limit, 'from', from, 'to', to);

        try {
            const logs = await exerciseService.getLogs(req.user.username, limit, from, to);
            res.json({...req.user, ...logs});
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });

    const resolveUser = async (req, res, next) => {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) {
                res.status(404).json({error: `user with id ${req.params.id} not found`});
                res.end();
                return
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(500).json({error: err.toString()});
            res.end();
        }

    };

    userRouter.use('/:id', resolveUser);
    userRouter.use('/:id/exercises', exerciseRouter);
    userRouter.use('/:id/logs', logsRouter);
    app.use('/api/users', userRouter);

    return app;
}

module.exports = createApp;