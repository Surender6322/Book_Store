const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();

const {addBook,library}=require('../controllers/books')

//Add
router.post('/book/add',auth,addBook)

//Library 
router.get('/books',library)


module.exports=router