const auth = require("../middleware/auth");
const express = require("express");

const {register,login,logoutall}=require('../controllers/user')

const router = new express.Router();

//Register Users 
router.post("/users/register", register)

//Login users
router.post("/users/login",login);

//Logout User
router.post('/users/logoutall',auth,logoutall)

module.exports=router