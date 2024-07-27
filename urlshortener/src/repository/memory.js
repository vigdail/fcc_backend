class Repository {
    constructor() {
        this.urls = new Map();
    }

    async count() {
        return this.urls.size;
    }

    async add(originalUrl, shortUrl) {
        this.urls.set(shortUrl, originalUrl);
    }

    async get(shortUrl) {
        return this.urls.get(shortUrl);
    }
}

module.exports = Repository;
