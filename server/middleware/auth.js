const jwt = require("jsonwebtoken");
const User = require("../models/users")

const config = process.env;

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.access_token;
  
    //console.log("req.cookies.access_token",req.cookies.access_token);
  
    if (!token) {
      return res.status(301).json({err : "A token is required for authentication"});
    }
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    const user = await User.findById(decoded.user_id).select({'password':0})
    if(!user) {
      res.clearCookie("access_token");
      return res.status(403).json({err : "A token is required for authentication"});
    }
    req.user = user;
  } catch (err) {
    return res.status(403).json({err : "A token is required for authentication"});  
  }
  return next();
};

module.exports = verifyToken;