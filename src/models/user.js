const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
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
    age: {
      type: DataTypes.INTEGER,
      allowNull:false,
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

  User.beforeCreate(async (user, options) => {
    user.username = user.username.trim();
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.password = await bcrypt.hash(user.password, 8);
    user.tokens = JSON.stringify([]);
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
      user.password = user.password.trim();
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  User.prototype.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user.id.toString(),userType:"user" }, "secret_secret");

    // Get the current tokens as an array
    let tokens = JSON.parse(user.tokens || "[]");

    // Add a new token object
    tokens.push({ token });

    // Update the 'tokens' field with the updated array by serializing it back to a string
    user.tokens = JSON.stringify(tokens);

    // Save the updated tokens back to the database
    await user.save();

    return token;
  };

  User.findByCredentials = async(username, password) => {
    const user = await User.findOne({where :{ username:username}})

    if(!user){
      throw new Error("Unable to login !!")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      throw new Error("Unable to login !!")
    }

    return user
  }

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;          //deleted password from the response
    delete values.tokens;
    return values;
  };

  return User;
};