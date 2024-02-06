const jwt = require("jsonwebtoken");
const db = require("../db/index");
const { Op, literal } = require("sequelize");
const Admin = db.admin;
const Users = db.user;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   // console.log(decoded.userType)
    if (decoded.userType === "admin") {
      const admin = await Admin.findOne({
        where: {
          id: decoded.id
        },
      });
      if(!admin){
        throw new Error("Please signup!!!")
    }
    const adminTokens = JSON.parse(admin.tokens)
    const tokenExists = adminTokens.some(
        (at) => at.token === token
    )
    // console.log("1==-=-=-=-=-=-=-=-=")

    if(!tokenExists) {
        // console.log("2==-=-=-=-=-=-=-=-=")
        throw new Error("Authenticate yourself...")
    }
    req.token = token
    req.admin = admin
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
   
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(404).send({ error: "Please authenticate!" });
  }

};

module.exports = auth;
