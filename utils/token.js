const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
    const { email, userRole } = userInfo;
    console.log(email, userRole);
    const payload = {
        email: userInfo.email,
        role: userInfo.userRole.roleName
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    return token;
}