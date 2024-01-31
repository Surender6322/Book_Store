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

//get books
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

    // category as multiselect filter
    if (categories && Array.isArray(categories) && categories.length > 0) {
      filters.name = {
        [Op.in]: categories,
      };
    }

    // publication year range filter
    if (minPublicationYear && maxPublicationYear) {
      filters.publicationYear = {
        [Op.between]: [minPublicationYear, maxPublicationYear],
      };
    } else if (minPublicationYear) {
      filters.publicationYear = {
        [Op.gte]: minPublicationYear,
      };
    } else if (maxPublicationYear) {
      filters.publicationYear = {
        [Op.lte]: maxPublicationYear,
      };
    }

    // cost range filter
    if (minCost && maxCost) {
      filters.cost = {
        [Op.between]: [minCost, maxCost],
      };
    } else if (minCost) {
      filters.cost = {
        [Op.gte]: minCost,
      };
    } else if (maxCost) {
      filters.cost = {
        [Op.lte]: maxCost,
      };
    }

    // rating filter
    if (minRating) {
      filters.rating = {
        [Op.gte]: [minRating],
      };
    }

    // order date range filter
    if (minOrderDate && maxOrderDate) {
      filters.order_date = {
        [Op.between]: [minOrderDate, maxOrderDate],
      };
    } else if (minOrderDate) {
      filters.order_date = {
        [Op.gte]: minOrderDate,
      };
    } else if (maxOrderDate) {
      filters.order_date = {
        [Op.lte]: maxOrderDate,
      };
    }

    // languages as multiselect filter
    if (languages && Array.isArray(languages) && languages.length > 0) {
      filters.lang = {
        [Op.in]: languages,
      };
    }

    const books = await Books.findAll({
      where: filters,
      include: [
        {
          model: Languages,
          where: filters,
        },
        {
          model: Reviews,
          where: filters,
        },
        {
          model: Categories,
          where: filters,
        },
        {
          model: Orders,
          where: filters,
        },
      ],
      distinct: true,
    });

    res.send({ books });
  } catch (error) {
    console.error("Error listing books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addBook, library };
