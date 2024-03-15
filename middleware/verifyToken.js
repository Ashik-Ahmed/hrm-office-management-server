const jwt = require('jsonwebtoken');
const { promisify } = require('util');



module.exports = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')?.[1];

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                error: 'You are not logged in'
            })
        }

        const decodecd = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decodecd;

        next();

    } catch (error) {
        return res.status(403).json({
            status: 'Failed',
            error: 'Invalid Token'
        })
    }
}