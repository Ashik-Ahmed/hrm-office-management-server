const User = require("../models/User");

//create a new user
exports.createUserService = async (userInfo) => {
    // console.log(userInfo);

    const user = await User.create(userInfo);
    return user;
}

// find a user by email 
exports.findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user
}

//find all users
exports.getAllUserService = async () => {
    const users = await User.aggregate([
        {
            $project: {
                email: 1,
                firstName: 1,
                lastName: 1,
                userRole: 1,
                designation: 1,
                photo: 1
            }
        }
    ])
    return users;
}