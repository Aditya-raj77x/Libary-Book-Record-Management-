const express = require("express");

//importing books data
const { users } = require("../data/users.json");
const { books } = require("../data/books.json");

const router = express.Router();

// ROUTES

/**
 * Route:/books
 * method:GET
 * Descripstion:Getting all the books
 * Access:public
 * Parameters: None
 */
router.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        data:books
    })
})

/**
 * Route:/books/id
 * method:GET
 * Descripstion:Getting book by id
 * Access:public
 * Parameters: None
 */
 router.get("/:id",(req,res)=>{
     const {id}=req.params
     const book=books.find((each)=> each.id===id)
     if(!book) return res.status(404).json({
         success:false,
         message:"book not found"
     })
     return res.status(200).json({
         success:true,
         data:book
     })
})

/**
 * Route:/books/issued/book
 * method:GET
 * Descripstion:Getting all issued book
 * Access:public
 * Parameters: None
 */
router.get("/issued/book",(req,res)=>{
    const userWithIssueBook=users.filter((each)=>{
        if(each.issuedBook) return each
    })
    const issueBook=[ ]
    userWithIssueBook.forEach((each)=>{
        const book=books.find((book)=> book.id===each.issuedBook)
        book.issuedBy=each.name
        book.issuedDate=each.issuedDate
        book.returnDate=each.returnDate
        issueBook.push(book)
        
    })


    if(issueBook.length===0){
        return res.status(404).json({
            success:false,
            message:"no issued book at the moment"
        })
    }
    return res.status(200).json({
        success:true,
        data:issueBook
    })
})

/**
 * Route:/books
 * method:POST
 * Descripstion:Adding a new book
 * Access:public
 * Parameters: None
 * data: author name genra price publisher id
 */
router.post("/",(req,res)=>{
    const {data}=req.body
    if(!data) return res.status(400).json({
        success:false,
        message:"no data provided"
    })
    const book=books.find((each)=> each.id === data.id)
    if(book) return res.status(404).json({
        success:false,
        message:"id already exist"
    })

    const allbooks=[...books,data]
    return res.status(200).json({
        success:true,
        data:allbooks
    })

})

/**
 * Route:/books/:id
 * method:PUT
 * Descripstion:Updating a book
 * Access:public
 * Parameters: id
 * data: author name genra price publisher id
 */

router.put("/:id",(req,res)=>{
    const {id}=req.params
    const {data}=req.body
    const book =books.find((each)=>each.id===id)
    if(!data) return res.status(400).json({
        success:false,
        message:"no data sent by the user"
    })

    if(!book) return res.status(400).json({
        success:false,
        message:"book not found with this id"
    })
    const updateData=books.map((each)=>{
        if(each.id===id){
            return{...each,...data}
        }
        return each
    })
    return res.status(200).json({
        success:true,
        data:updateData
    })
})

/**
 * Route:/books/issuedWithFine
 * method:Get
 * Descripstion:Getting all books with fine
 * Access:public
 * Parameters: None
 * data: None
 */
router.get("/issuedBook/WithFine",(req,res)=>{
    const allIssueUser=users.filter((each)=>{
        if(each.issuedBook){
            return each
        }
    
    })

    if(!allIssueUser) return res.status(400).json({
        success:false,
        message:"no issued books"
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
      
     
     const user=allIssueUser.map((each)=>{
        const getSubType=(date)=>{
            if(each.subscriptionType==="Basic"){
              date=date+90
            }else if(each.subscriptionType==="Standard"){
              date=date+180
            }else if(each.subscriptionType==="Premium"){
              date=date+365
            }
            return date
          }
        let returnDate = getDateInDays(each.returnDate);
        let currentDate = getDateInDays();
        let subscriptionDate = getDateInDays(each.subscriptionDate);
        let subscriptionExpiration = getSubType(subscriptionDate);

        const data = {
            ...each,
            fine:
              returnDate < currentDate
                ? subscriptionExpiration <= currentDate
                  ? 200
                  : 100
                : 0,
            
          };
          return data
      
     })
    const userWithFine=user.filter((each)=>{
        if(each.fine==0){
            
        }else{
            return each
        }
    })
    const finalData=userWithFine.map((Each)=>{
        return books.filter((ea)=> {
            if(Each.issuedBook===ea.id){
                const rex={
                    ...ea,
                    fine:Each.fine

                }
                return rex
            }
        })
    })
    const fd=[...finalData]
    
    
    
    
    res.status(200).json({
        success:true,
        data:fd
    })
     
})
module.exports = router
