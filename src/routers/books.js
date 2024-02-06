const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();

const {addBook,library, addAuthor}=require('../controllers/books')

//Add
router.post('/book/add',auth,addBook)

//Library 
router.get('/books',library)

//adding author
router.post('/add', addAuthor);


module.exports=router