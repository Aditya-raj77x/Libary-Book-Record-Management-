const mongoose=require("mongoose")
function DBS(){
    const URl=process.env.MONGO_URI

    mongoose.connect(URl)
    const db=mongoose.connection
    db.on("error",console.error.bind(console,"connection error"))
    db.once("open",function(){
        console.log("DB connected")
    })

}
module.exports=DBS