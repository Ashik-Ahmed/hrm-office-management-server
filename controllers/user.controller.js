const { createUserService } = require("../services/user.service");

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