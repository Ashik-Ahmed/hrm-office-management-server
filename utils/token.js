const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
    const { email, role } = userInfo;
    console.log(email, role);
    const payload = {
        email: userInfo.email,
        role: userInfo.role
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    return token;
}