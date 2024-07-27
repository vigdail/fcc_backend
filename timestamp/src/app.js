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
    let param = req.params.date;
    if (param === undefined) {
        param = Date.now().toString();
    }
    let unix;
    if (/^\d+$/.test(param)) {
        unix = Number(param);
    } else {
        unix = Date.parse(param);
    }
    if (!isNaN(unix)) {
        const utc = new Date(unix).toUTCString();
        res.json({utc: utc, unix: unix});
    } else {
        res.json({error: "Invalid Date"})
    }
});

module.exports = app