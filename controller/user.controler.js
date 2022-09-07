const { userModel, bookModel } = require("../models");// importing Models

exports.getAllUsers=async(req, res) => {
    const users=await userModel.find();
    if(users.length===0) return res.status(404).json({
        success:false,
        message:"no users till yet"
    })
    res.status(200).json({
      success: true,
      message: users,
    });
};

exports.getSingleUserById= async(req, res) => {
    const { id } = req.params;
    const user = await userModel.findById({
        _id:id
    })
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
};

exports.createNewUser=async (req, res) => {
    const { data } =req.body;
    
    const users = await userModel.create(data);

    res.status(200).json({
      success: true,
      data: users,
    });
};

exports.updateUserInfo=async(req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user =await userModel.findByIdAndUpdate({_id:id},{
        $set:{
            ...data

        }
    },{new:true})
    
    
  
    res.status(200).json({
      success: true,
      data: user,
    });
};

exports.deleteUser=async(req, res) => {
    const { id } = req.params;
    const user = await userModel.deleteOne({
        _id:id
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message:"user deleted successfully",
    });
};

exports.getSubcriptionDetailsById=async(req,res)=>{
  const {id}=req.params
  
  const user=await userModel.findById({_id:id})

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
    ...user._doc,
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
};

