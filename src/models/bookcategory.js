module.exports=(sequelize,DataTypes)=>{
    const bookcategory=sequelize.define("bookcategory",{
        bookId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        categoryId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    })
    return bookcategory;
}