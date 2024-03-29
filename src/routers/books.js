const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();

const {addBook,library,addLanguage,addCategory,addAuthor}=require('../controllers/books')

//Add
router.post('/book/add',auth,addBook)

//Library 
router.get('/books',library)

//adding author
router.post('/author/add', auth , addAuthor);

// Language
router.post("/language/add",auth,addLanguage)

//Category
router.post("/category/add",auth,addCategory)

module.exports=router