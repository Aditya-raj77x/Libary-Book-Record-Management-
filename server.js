const express = require("express");
const app = express();
const port = 8081;

//importing data
const { users } = require("./data/users.json");
const { books } = require("./data/books.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server  is up and running",
  });
});
/**
 * Route:users
 * method:GET
 * Descripstion:getting all users
 * Access:public
 * Parameters:None
 */
app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    message: users,
  });
});

/**
 * Route:users/:id
 * method:GET
 * Descripstion:getting single users bu id
 * Access:public
 * Parameters: id
 */

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Route:users
 * method:Post
 * Descripstion:create new user
 * Access:public
 * Parameters: None
 */

app.post("/users", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;
  const user = users.find((each) => each.id === id);
  if (user) {
    res.status(404).json({
      success: false,
      message: "user already exist",
    });
  }
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });
  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Route:users/:id
 * method:Put
 * Descripstion:updating user   info
 * Access:public
 * Parameters: id
 */
app.put("/users/:id",(req,res)=>{
    const {id} = req.params
    const {data}=req.body
    const user=users.find((each)=>each.id===id)
    if(!user) return res.status(404).json({
        success:false,
        message:"user not  found"
    })
    const updatedUser=users.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data,
            }
        }
        return each
    })
    
    res.status(200).json({
        success:true,
        data:updatedUser
    })
})


app.get("*", (req, res) => {
  res.status(200).json({
    message: "this route does not exiest",
  });
});
app.listen(port, (req, res) => {
  console.log(` server is running at port ${port}`);
});
