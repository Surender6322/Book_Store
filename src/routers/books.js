const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();

const {addBook,library,addLanguage,addCategory}=require('../controllers/books')

//Add
router.post('/book/add',auth,addBook)

//Library 
router.get('/books',library)

//Language
router.post("/language/add",auth,addLanguage)

//Category
router.post("/category/add",auth,addCategory)


module.exports=router