const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    }
})

const User = mongoose.model('users', UserSchema);

const toModel = (user) => {
    if (!user) {
        return null;
    }
    return {
        _id: user._id,
        username: user.username
    }
}

class UserRepository {
    async createUser(username) {
        const user = new User({username});
        const r = await user.save();

        return r._id;
    }

    async getByUsername(username) {
        const result = await User.findOne({username}).exec();
        return toModel(result);
    }

    async getById(id) {
        const result = await User.findById(id).exec();
        return toModel(result);
    }

    async all() {
        const results = await User.find();
        return results.map(toModel);
    }
}

module.exports = UserRepository;