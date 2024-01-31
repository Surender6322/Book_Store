const jwt = require("jsonwebtoken");
const db = require("../db/index");
const { Op, literal } = require("sequelize");
const Admin = db.admin;
const Users = db.users;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userType === "admin") {
      const user = await Admin.findOne({
        where: {
          id: decoded.id,
          [Op.and]: literal(
            `JSON_CONTAINS(tokens, '${JSON.stringify({ token: token })}')`
          ),
        },
      });
      if (!user) {
        throw new Error();
      }
      req.admin = user;
      req.token = token;
      next();
    }
    if (decoded.userType === "user") {
      const user = await Users.findOne({
        where: {
          id: decoded.id,
          [Op.and]: literal(
            `JSON_CONTAINS(tokens, '${JSON.stringify({ token: token })}')`
          ),
        },
      });
      if (!user) {
        throw new Error();
      }
      req.user = user;
      req.token = token;
      next();
    }
  } catch (e) {
    console.log(e);
    return res.status(404).send({ error: "Please authenticate!" });
  }
};

module.exports = auth;
