module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicationYear:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost:{
      type: DataTypes.DECIMAL(10,2) ,//10 digits in total with 2 decimal places
      allowNull:false,
      validate:{
        isDecimal:true,
        min:0,
      }
    },
    copies:{
        type:DataTypes.INTEGER,
        allownull:false,
        validate: {
          isInt: true, // Ensure it is an integer
          min: 0, // Minimum value allowed is 0
        },
    },
  });
  return Book;
};