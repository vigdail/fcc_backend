require('dotenv').config();
const App = require('./src/app');
const Service = require('./src/service')
const Repository = require('./src/repository/memory')

const repository = new Repository();
const service = new Service(repository);
const app = new App(service);

// Basic Configuration
const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
