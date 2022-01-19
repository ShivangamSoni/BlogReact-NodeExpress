const JWT = require("jsonwebtoken");
const { JWT_Secrete_Key } = require("../CONSTANTS");

const verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization == undefined) {
    res.status(400).json({ success: false, message: "Invalid Auth Request" });
    return;
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    res.status(400).json({ success: false, message: "Invalid Auth Request" });
    return;
  }

  try {
    const payload = JWT.verify(token, JWT_Secrete_Key);
    req.payload = payload;
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: "Token Expired" });
  }
};

module.exports = verifyJWT;
