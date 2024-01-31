const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();
const {
  register,
  login,
  logoutAllAdmin,
  getuser,
  deleteuser,
} = require("../controllers/admin");

//Register Librarian
router.post("/librarian/register", register);

//Login users
router.post("/librarian/login", login);

//Logout User
router.post("/librarian/logout", auth, logout);

//Get all users
router.get("/users/all", auth, getuser);

//Delete user
router.delete("/users/delete/:id", auth, deleteuser);

module.exports = router;
