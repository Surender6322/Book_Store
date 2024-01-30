module.exports=(sequelize,DataTypes)=>{
    const booklanguage=sequelize.define("booklanguage",{
        bookId: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        languageId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    })
    return booklanguage;
}