const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);  // Log the authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No authorization header or Bearer token found");
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(403).json({
            message: "Forbidden"
        });
    }
};

module.exports = {
    authMiddleware
};
