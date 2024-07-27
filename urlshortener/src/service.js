class Service {
    constructor(repo) {
        this.repo = repo
    }

    async shortUrl(url) {
        if (!this.#isValidUrl(url)) {
            return Promise.reject('invalid url');
        }
        const count = await this.repo.count();
        const shortUrl = this.#generateNextUrl(count);
        await this.repo.add(url, shortUrl);
        return shortUrl;
    }

    async getOriginalUrl(shortUrl) {
        const result = await this.repo.get(shortUrl);
        if (result) {
            return result;
        }

        return Promise.reject('No short URL found for the given input');
    }

    #isValidUrl(url) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(url);
    }

    #generateNextUrl(count) {
        return count.toString();
    }
}

module.exports = Service;
