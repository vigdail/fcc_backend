class Service {
    constructor(repo) {
        this.repo = repo;
    }

    async createUser(username) {
        const user = await this.repo.getByUsername(username);
        if (user) {
            throw new Error(`user ${username} already exists`);
        }
        const id = await this.repo.createUser(username);
        return {
            _id: id,
            username,
        }
    }

    async getById(id) {
        return await this.repo.getById(id);
    }

    async all() {
        return this.repo.all();
    }
}

module.exports = Service;