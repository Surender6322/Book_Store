module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define("language", {
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return language;
};
