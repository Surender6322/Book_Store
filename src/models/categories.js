module.exports= (sequelize,DataTypes)=>{
  const category=sequelize.define("category",{
  name:{
    type:DataTypes.STRING,
    allowNull:false,
  }
})
  return category;
}