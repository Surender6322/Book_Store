const express = require("express");
require("./db/index");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
