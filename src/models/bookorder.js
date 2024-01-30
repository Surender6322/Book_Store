module.exports=(sequelize,DataTypes)=>{
    const bookorder=sequelize.define("bookorder",{
        bookId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        orderId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    })
    return bookorder;
}