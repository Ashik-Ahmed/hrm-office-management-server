const { createUserService, findUserByEmail, getAllUserService } = require("../services/user.service");
const { generateToken } = require("../utils/token");

exports.createUser = async (req, res) => {
    // console.log(req.body);
    try {
        const user = await createUserService(req.body);
        console.log(user);
        if (user) {
            res.status(200).json({
                status: 'Success',
                message: 'Successfully created User',
                data: user
            })
        }
        else {
            res.status(500).json({
                status: 'Failed',
                message: 'Failed! Try again.'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


// user login 
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.status(401).json({
                status: 'Failed',
                error: 'please provide email and password'
            })
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: 'Failed',
                error: 'No user found'
            })
        }

        const isPasswordMatched = user.comparePassword(password, user.password);

        if (!isPasswordMatched) {
            return res.status(403).json({
                status: 'Failed',
                error: 'Password is not correct'
            })
        }

        const token = generateToken(user);
        const { password: pwd, ...others } = user.toObject();
        console.log('Found User:', others);

        res.status(200).json({
            status: 'Success',
            message: 'Successfully logged in',
            data: {
                user: others,
                token
            }
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}


exports.getAllUser = async (req, res) => {
    try {
        const users = await getAllUserService()

        if (!users) {
            return res.status(401).json({
                status: 'Failed',
                error: 'Failed! Try again.'
            })
        }

        res.status(200).json({
            status: 'Success',
            data: {
                users
            }
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}