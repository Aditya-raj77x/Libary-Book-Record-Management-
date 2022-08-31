const express = require("express");

const port = 8081;
const dotenv=require("dotenv")

//dataBase Conection
const DBS=require("./databaseConnection")

// importing routies
const usersRouter=require("./routes/users")
const booksRouter=require("./routes/books")

dotenv.config()

const app = express();
DBS()
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server  is up and running",
  });
});

app.use("/users", usersRouter)
app.use("/books", booksRouter)



app.get("*", (req, res) => {
  res.status(200).json({
    message: "this route does not exiest",
  });
});
app.listen(port, (req, res) => {
  console.log(` server is running at port ${port}`);
});
