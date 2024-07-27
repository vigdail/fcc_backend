const express = require('express');
const cors = require('cors');
const path = require('path')

const app = express();
const dir = path.join(__dirname, "..");

app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(dir, 'views', 'index.html'));
});

app.get("/api/:date?", function (req, res) {
    const date = req.params.date ?? Date.now();
    const unix = getUnixTime(date);
    if (!isNaN(unix)) {
        const utc = new Date(unix).toUTCString();
        res.json({utc: utc, unix: unix});
    } else {
        res.json({error: "Invalid Date"})
    }
});

function getUnixTime(date) {
    if (/^\d+$/.test(date)) {
        return Number(date);
    }

    return Date.parse(date);
}

module.exports = app