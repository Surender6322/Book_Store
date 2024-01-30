module.exports=(sequelize,DataTypes)=>{
    const bookauthor=sequelize.define("bookauthor",{
        bookId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        authorId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    })
    return bookauthor;
}