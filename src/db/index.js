const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log('Connected')
}).catch((err) => {
    console.log(err)
})

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize

//require models
db.user=require('../models/user')(sequelize,DataTypes)
db.books=require('../models/books')(sequelize,DataTypes)
db.admin=require('../models/admin')(sequelize,DataTypes)
db.categories=require('../models/categories')(sequelize,DataTypes)
db.bookcategory=require('../models/bookcategory')(sequelize,DataTypes)
db.author=require('../models/author')(sequelize,DataTypes)
db.bookauthor=require('../models/bookauthor')(sequelize,DataTypes)
db.language=require('../models/language')(sequelize,DataTypes)
db.booklanguage=require('../models/booklanguage')(sequelize,DataTypes)
db.reviews=require('../models/reviews')(sequelize,DataTypes)
db.orders=require('../models/orders')(sequelize,DataTypes)
db.bookorder=require('../models/bookorder')(sequelize,DataTypes)

//Many to Many relation between books and category
db.books.belongsToMany(db.categories, { through: 'bookcategory', foreignKey: 'bookId' });
db.categories.belongsToMany(db.books, { through: 'bookcategory', foreignKey: 'categoryId' });

//Many to Many between user and books through reviews
db.books.belongsToMany(db.user, { through: 'reviews', foreignKey: 'bookId' });
db.user.belongsToMany(db.books, { through: 'reviews', foreignKey: 'userId' });

//Many to Many between books and language 
db.books.belongsToMany(db.language, { through: 'booklanguage', foreignKey: 'bookId' });
db.language.belongsToMany(db.books, { through: 'booklanguage', foreignKey: 'languageId' });

//Many to Many books and orders
db.books.belongsToMany(db.orders, { through: 'bookorder', foreignKey: 'bookId' });
db.orders.belongsToMany(db.books, { through: 'bookorder', foreignKey: 'orderId' });

//Many to Many books and authors 
db.books.belongsToMany(db.author, { through: 'bookauthor', foreignKey: 'bookId' });
db.author.belongsToMany(db.books, { through: 'bookauthor', foreignKey: 'authorId' });

//One to Many between users and orders
db.user.hasMany(db.orders,{foreignKey:'userId'})
db.orders.belongsTo(db.user,{foreignKey:'userId'})

sequelize.sync()
  .then(() => {
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


module.exports = db