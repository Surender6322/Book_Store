const db = require("../db/index");
const Librarian = db.librarian;
const User=db.user;

const register=async (req, res) => {
    try {
      const { name, email, password, } = req.body;
  
     // Create a new librarian                   
      const newUser = await Librarian.create({
        name,
        email,
        password,
      });
  
      const token = await newUser.generateToken(); //generating token
  
      res
        .status(201)
        .json({ message: "Librarian registered successfully", newUser, token });
    } catch (error) {
      console.error("Error registering librarian:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


const login= async (req, res) => {
    try {
      const { name, password } = req.body;
  
      const librarian = await Librarian.findByCredentials(name, password)
      const token = await librarian.generateToken();
  
      res.json({ message: "Librarian Login successful", librarian, token });
    } catch (e) {
      console.error("Error logging in librarian:", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

const getuser=async(req,res)=>{
    if(req.userType!=='librarian')
    {
        return res.status(403).json({ error: 'Access forbidden. You can not access the list of Customers.' });
    }
    try {
        const customers = await User.findAll();
        res.json(customers);
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

const deleteuser=async(req,res)=>{
    if(req.userType!=='librarian')
    {
        return res.status(403).json({error:'You can not delete a user!'})
    }
    try {
        const userId = req.params.id;
        const user = await User.destroy({ where: { id: userId } });
         

        if (user === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }
    
        res.json(user);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

module.exports={register,login,getuser,deleteuser}