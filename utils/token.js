const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
    const { email, userRole } = userInfo;

    const payload = {
        email: userInfo.email,
        role: userInfo.userRole
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    return token;
}