const jwt = require("jsonwebtoken");
const MyColl = require("../model/loginRegister");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.SECRET_KEY_JWT);

    const user = await MyColl.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    console.log(token);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ Error: "User Not Authenticated!" });
  }
};

module.exports = auth;
