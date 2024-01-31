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
router.post("/admin/register", register);

//Login users
router.post("/admin/login", login);

//Logout User
router.post("/admin/logout", auth, logoutAllAdmin);

//Get all users
router.get("/users/all", auth, getuser);

//Delete user
router.delete("/users/delete/:id", auth, deleteuser);

module.exports = router;
