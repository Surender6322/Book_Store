const db = require("../db/index");
const Admin = db.admin;
const User = db.user;
const { Op } = require("sequelize");

const register = async (req, res) => {
  try {
    // Create a new Admin
    const newUser = await Admin.create(req.body);

    const token = await newUser.generateToken(); //generating token

    res
      .status(201)
      .json({ message: "Admin registered successfully", newUser, token });
  } catch (error) {
    console.error("Error registering Admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findByCredentials(email, password);
    const token = await admin.generateToken();

    res.json({ message: "Admin Login successful", admin, token });
  } catch (e) {
    console.error("Error logging in admin:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutAllAdmin = async (req, res) => {
  try {
    if (!req.admin) {
      return res
        .status(404)
        .send({ error: "Please authenticate as an admin!" });
    }
    const admin = req.admin;
    admin.tokens = [];
    await admin.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error!" });
  }
};

const getuser = async (req, res) => {
  if (!req.admin) {
    return res.status(403).json({
      error: "Access forbidden. You can not access the list of Customers.",
    });
  }
  try {
    const { minAge, maxAge, gender } = req.query;
    let whereclause = {};
    if (gender) {
      whereclause.gender = gender;
    }

    if (minAge && maxAge) {
      whereclause.age = {
        [Op.between]: [minAge, maxAge],
      };
    } else if (minAge) {
      whereclause.age = {
        [Op.gte]: [minAge],
      };
    } else if (maxAge) {
      whereclause.age = {
        [Op.lte]: [maxAge],
      };
    }
    const customers = await User.findAll({ where: whereclause });
    res.json(customers);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteuser = async (req, res) => {
  if (!req.admin) {
    return res.status(403).json({ error: "You can not delete a user!" });
  }
  try {
    const userId = req.params.id;
    const user = await User.destroy({ where: { id: userId } });

    if (user === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, logoutAllAdmin, getuser, deleteuser };
