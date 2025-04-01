const jwt = require('jsonwebtoken');
const taskSign = require('../models/User');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    jwt.verify(token, 'athulsecretKey', (err, user) => {
        if (err) {
            console.error("JWT Error:", err.message);
            return res.status(403).json({ message: "Invalid token" });
        }
        // console.log("Decoded User:", user); 
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
