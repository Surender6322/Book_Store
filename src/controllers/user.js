const db = require("../db/index");
const User = db.user;

const register = async (req, res) => {
  try {
    // Create a new user
    const newUser = await User.create(req.body);

    const token = await newUser.generateToken(); //generating token

    res
      .status(201)
      .json({ message: "User registered successfully", newUser, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByCredentials(username, password);
    const token = await user.generateToken();

    res.json({ message: "Login successful", user, token });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutall = async (req, res) => {
  try {
    const curruser = req.user;
    curruser.tokens = [];
    await curruser.save();
  } catch (e) {
    console.error("Error logging out:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, logoutall };
