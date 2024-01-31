const express = require("express");
require("./db/index");

const app = express();
const port = process.env.PORT;
const adminRouter = require("./routers/admin");
const userRouter = require("../src/routers/user");
const bookRouter = require("../src/routers/books");

app.use(express.json());
app.use(adminRouter);
app.use(userRouter);
app.use(bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
