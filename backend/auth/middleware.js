const { JWT_SECRET } = require('../config/config.js');
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const cherry = authHeader && authHeader.split(' ')[1];

    if (!cherry) {
        return res.status(401).json({ error: "No token da" });
    }
    try {
        const decoded = jwt.verify(cherry, JWT_SECRET);
        req.userId = decoded.userId; 
        req.userName = decoded.name; 
        next();
    } catch (e) {
        return res.status(403).json({ error: "INval toklen" });
    }
};

const signTokenJWT = (userId, userName) =>{
	return jwt.sign({ userId: userId, name: userName }, JWT_SECRET, { expiresIn: '200d' });
}

module.exports = {
	signTokenJWT,
	authenticateJWT
}
