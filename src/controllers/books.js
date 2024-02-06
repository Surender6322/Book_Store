const db = require("../db/index");
const Books = db.books;
const Orders = db.orders;
const Reviews = db.reviews;
const Categories = db.categories;
const Author = db.author;
const Languages = db.language;

//const { Sequelize } = require('sequelize');

const addBook = async (req, res) => {
  if (!req.admin) {
    return res
      .status(403)
      .json({ error: "Access forbidden. Only admin can add books." });
  }
  try {
    const newBook = await Books.create(req.body);

    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
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

module.exports = { addBook, library };
