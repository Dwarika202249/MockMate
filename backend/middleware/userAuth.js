const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];

  // Check if not token or if token is improperly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object
    req.user = decoded.user;

    next(); // Move on to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
