const jwt = require('jsonwebtoken');

 const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    

  
console.log("Token:", token); // Log the token

    if (!token) return res.status(401).send("Access denied.No token provided");

    try {
        const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = verified.userId;
        next();
    } catch (err) {
        console.log(err)
        res.status(401).send("Invalid or malformed token");
    }
};
module.exports= authenticateUser;