const db = require("../db/index");
const Books = db.books;
const Orders = db.orders;
const Reviews = db.reviews;
const Categories = db.categories;
const Author = db.author;
const Languages = db.language;
const BookCategory = db.bookcategory
const BookLanguage = db.booklanguage
const BookAuthor = db.bookauthor;

//const { Sequelize } = require('sequelize');

//Add Language
const addLanguage = async(req,res) => {
  if (!req.admin) {
    return res
      .status(403)
      .json({ error: "Access forbidden. Only admin can add Language" });
  }
  try{
    const newLanguage = await Languages.create(req.body);

    res
      .status(201)
      .json({ message: "Langauge created successfully", Language: newLanguage });

  }catch(e){
    res.status(500).json({message : e})
  }
}

//Add Category
const addCategory = async(req,res) => {
  if (!req.admin) {
    return res
      .status(403)
      .json({ error: "Access forbidden. Only admin can add Category" });
  }
  try{
    
    const newCategory = await Categories.create(req.body);

    res
      .status(201)
      .json({ message: "Category created successfully", Category: newCategory });
  }catch(e){
    res.status(500).json({message : e})
  }
}

//Add Author

const addAuthor = async (req, res) => {
  try {
      const { name, gender } = req.body;

      // Check if an author with the same name already exists
      const existingAuthor = await Author.findOne({ where: { name } });

      if (existingAuthor) {
          return res.status(400).json({ error: 'Author with the same name already exists.' });
      }

      // If the author doesn't exist, create a new one
      const newAuthor = await Author.create({ name, gender });

      res.status(201).json(newAuthor);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addBook = async (req, res) => {

  if (!req.admin) {
      return res.status(403).json({ error: "Access forbidden. Only admin can add books." });
  }

  try {
      // Extract book details from the request body
      const { title, publicationYear, cost, copies, authorId,languageId,categoryId } = req.body;

      const existingLanguage = await Languages.findByPk(languageId)
      if (!existingLanguage){
        return res.status(404).json({ error: 'Language with the provided ID does not exist.' });
      }
      // Check if the author with the given ID exists
      const existingAuthor = await Author.findByPk(authorId);

      if (!existingAuthor) {
          return res.status(404).json({ error: 'Author with the provided ID does not exist.' });
      }

      const existingCategory = await Categories.findByPk(categoryId)
      if(!existingCategory) {
        return res.status(404).json({ error: 'Category with the provided ID does not exist.' });
      }
      // Create a new book
      const newBook = await Books.create({ title, publicationYear, cost, copies });
      
      // Create an entry in the bookauthor table to establish the many-to-many relationship
      await BookLanguage.create({bookId:newBook.id,languageId})
      await BookCategory.create({bookId:newBook.id,categoryId})
      await BookAuthor.create({ bookId: newBook.id, authorId });

      res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};


// get books
const library = async (req, res) => {
  try {
    const {
      categories,
      minPublicationYear,
      maxPublicationYear,
      minCost,
      maxCost,
      minRating,
      minOrderDate,
      maxOrderDate,
      languages,
    } = req.query;

    let filters = {};

    // Apply filters based on query parameters

    // Apply category filter
    if (categories) {
      filters.name = {
        [Op.in]: Array.isArray(categories) ? categories : [categories],
      };
    }

    // Apply publication year filter
    if (minPublicationYear || maxPublicationYear) {
      filters.publicationYear = {};
      if (minPublicationYear) {
        filters.publicationYear[Op.gte] = minPublicationYear;
      }
      if (maxPublicationYear) {
        filters.publicationYear[Op.lte] = maxPublicationYear;
      }
    }

    // Apply cost filter
    if (minCost || maxCost) {
      filters.cost = {};
      if (minCost) {
        filters.cost[Op.gte] = minCost;
      }
      if (maxCost) {
        filters.cost[Op.lte] = maxCost;
      }
    }

    // Apply rating filter
    if (minRating) {
      filters.rating = {
        [Op.gte]: minRating,
      };
    }

    // Apply order date filter
    if (minOrderDate || maxOrderDate) {
      filters.order_date = {};
      if (minOrderDate) {
        filters.order_date[Op.gte] = minOrderDate;
      }
      if (maxOrderDate) {
        filters.order_date[Op.lte] = maxOrderDate;
      }
    }

    // Apply language filter
    if (languages) {
      filters.lang = {
        [Op.in]: Array.isArray(languages) ? languages : [languages],
      };
    }

    // Find books with applied filters
    const books = await Books.findAll({
      where: filters,
      include: [Languages, Reviews, Categories, Orders],
    });

    res.send({ books });
  } catch (error) {
    console.error("Error listing books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addBook, library, addLanguage, addCategory,addAuthor };
