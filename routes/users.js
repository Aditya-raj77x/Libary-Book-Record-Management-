const express = require("express");

// importing users data
const { users } = require("../data/users.json");

const router = express.Router();

// all the routes

/**
 * Route:users
 * method:GET
 * Descripstion:getting all users
 * Access:public
 * Parameters:None
 */
router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = users.find((each) => each.id === id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "user not  found",
    });
  const updatedUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});
/**
 * Route:users/:id
 * method:Put
 * Descripstion:delete a user by id
 * Access:public
 * Parameters: id
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);
  return res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Route:users/subdetails/:id
 * method:GET
 * Descripstion:get all user subscripstion detail
 * Access:public
 * Parameters: id
 */
router.get("/subdetails/:id",(req,res)=>{
  const {id}=req.params
  const user=users.find((each)=>each.id===id)
  if(!user) return res.status(404).json({
    success:false,
    message:"no user found"
  })
  const getDateInDays=(data="")=>{
    let date
    if(data===""){
      date=new Date()//current date
    }else{
      date= new Date(data)//date on bases of data variable
    }
    let days=Math.floor(date/(1000*60*60*24))// 60sec 60min 24 hours into 1000(cuz its in miliseconds)
    return days
  }
  const getSubType=(date)=>{
    if(user.subscriptionType==="Basic"){
      date=date+90
    }else if(user.subscriptionType==="Standard"){
      date=date+180
    }else if(user.subscriptionType==="Premium"){
      date=date+365
    }
    return date
  }
  //sub expieration part
  // jan 1 1970 UTC// miliseconds
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = getSubType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 200
          : 100
        : 0,
  };
  res.status(200).json({
    success:true,data
  })
})
module.exports = router;
