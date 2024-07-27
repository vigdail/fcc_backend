const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

class App {
    constructor(service) {
        this.app = express()
        this.service = service;

        this.#configureRouter();
    }

    listen(port, callback) {
        return this.app.listen(port, callback);
    }

    #configureRouter() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.use('/public', express.static(`${process.cwd()}/public`));

        this.app.get('/', function (req, res) {
            res.sendFile(process.cwd() + '/views/index.html');
        });

        this.app.get('/api/shorturl/:url', this.#getShortUrl.bind(this));
        this.app.post('/api/shorturl', this.#postShortUrl.bind(this));
    }

    async #getShortUrl(req, res) {
        const url = req.params.url;
        try {
            const original = await this.service.getOriginalUrl(url);
            res.redirect(original);
        } catch (err) {
            res.json({error: err});
        }
    }

    async #postShortUrl(req, res) {
        const url = req.body.url;
        try {
            const shortUrl = await this.service.shortUrl(url);
            res.json({original_url: url, short_url: shortUrl});
        } catch (err) {
            res.json({'error': err});
        }
    }
}


module.exports = App;
