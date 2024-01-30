module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    return Order;
};