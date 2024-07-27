const express = require('express');
const path = require("path");
const cors = require('cors');

const app = express();

app.use(cors({optionsSuccessStatus: 200})); // some legacy browsers choke on 204

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.get('/api/whoami', function (req, res) {
    const ipaddress = req.ip;
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];
    res.json({ipaddress, language, software});
});

module.exports = app;