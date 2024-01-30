module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define("author", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('m', 'f'),
        allowNull: false,
      },
    });
    return Author;
  };