const express = require("express");
const app = express();
const port = 8081;

// importing routies
const usersRouter=require("./routes/users")
const booksRouter=require("./routes/books")

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
