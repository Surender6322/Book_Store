module.exports= (sequelize,DataTypes)=>{
    const language=sequelize.define("language",{
    name: {
      type:DataTypes.STRING,
      allowNull:false,
     }
  })
    return language;
}