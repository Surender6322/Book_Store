const db=require('../db/index')
const Books=db.books

//const { Sequelize } = require('sequelize');

const addBook=async(req,res)=>{
    if(req.userType!=='librarian')
    {
        return res.status(403).json({ error: 'Access forbidden. Only librarians can add books.' });
    }
    try {
        const newBook = await Books.create(req.body);
    
        res.status(201).json({ message: 'Book created successfully', book: newBook });
      } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

//get books
const library=async(req,res)=>{

}

module.exports={addBook,library};