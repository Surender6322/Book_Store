const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("admin", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error("Password should be at least 8 characters long !!");
          }
        },
        isNotPassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error('Password cannot be "password !!"');
          }
        },
      },
    },
    tokens: {
      type: DataTypes.TEXT, // Store the array as a JSON text
      defaultValue: "[]",
      allowNull: false, // Default value as an empty array in string form
      get() {
        // Deserialize the stored JSON string to an array
        return JSON.parse(this.getDataValue("tokens") || "[]");
      },
      set(value) {
        // Serialize the array to a JSON string before storing
        this.setDataValue("tokens", JSON.stringify(value || []));
      },
    },
  });

  Admin.beforeCreate(async (user, options) => {
    user.name = user.name.trim();
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.password = await bcrypt.hash(user.password, 8);
    user.tokens = JSON.stringify([]);
  });

  Admin.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
      user.password = user.password.trim();
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  Admin.prototype.generateToken = async function () {
    const admin = this;

    
    const token = jwt.sign({ id: admin.id.toString(), userType:"admin" }, process.env.JWT_SECRET);

    // Get the current tokens as an array
    let tokens = JSON.parse(admin.tokens || "[]");

    // Add a new token object
    tokens.push({ token });

    // Update the 'tokens' field with the updated array by serializing it back to a string
    admin.tokens = JSON.stringify(tokens);

    // Save the updated tokens back to the database
    await admin.save();

    return token;
  };

  Admin.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({where :{email}})
    if(!admin){
      throw new Error("Unable to login !!")
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch){
      throw new Error("Unable to login !!")
    }
    return admin;
  }

  Admin.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.password;        
    delete values.tokens;
    return values;
  };


   return Admin;
};

