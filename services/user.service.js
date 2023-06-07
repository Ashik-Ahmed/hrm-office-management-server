const User = require("../models/User");

//create a new user
exports.createUserService = async (userInfo) => {

    const user = await User.create(userInfo);
    return user;
}