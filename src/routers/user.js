const auth = require("../middleware/auth");
const express = require("express");

const {register,login,logout,logoutall}=require('../controllers/user')

const router = new express.Router();

//Register Users 
router.post("/users/register", register)

//Login users
router.post("/users/login",login);

//Logout User
router.post('/users/logout',auth,logout)

router.post('/users/logoutall',auth,logoutall)

module.exports=router