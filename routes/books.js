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

module.exports = router
