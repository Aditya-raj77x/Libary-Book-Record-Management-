const express = require("express");

//importing books data
const { users } = require("../data/users.json");
const { books } = require("../data/books.json");
const { model } = require("mongoose");

//importing model
const { userModel, bookModel } = require("../models");
//importing functions
const { getAllBooks, getAllIssuedBooks, getanyBookById, addNewBook, updateBookById } = require("../controller/book.controler");


const router = express.Router();

// ROUTES

/**
 * Route:/books
 * method:GET
 * Descripstion:Getting all the books
 * Access:public
 * Parameters: None
 */
router.get("/", getAllBooks);

/**
 * Route:/books/id
 * method:GET
 * Descripstion:Getting book by id
 * Access:public
 * Parameters: None
 */
router.get("/:id",getanyBookById);
    

/**
 * Route:/books/issued/book
 * method:GET
 * Descripstion:Getting all issued book
 * Access:public
 * Parameters: None
 */
router.get("/issued/book", getAllIssuedBooks);

/**
 * Route:/books
 * method:POST
 * Descripstion:Adding a new book
 * Access:public
 * Parameters: None
 * data: author name genra price publisher id
 */
router.post("/", addNewBook)

/**
 * Route:/books/:id
 * method:PUT
 * Descripstion:Updating a book
 * Access:public
 * Parameters: id
 * data: author name genra price publisher id
 */

router.put("/:id", updateBookById);

/**
 * Route:/books/issuedWithFine
 * method:Get
 * Descripstion:Getting all books with fine
 * Access:public
 * Parameters: None
 * data: None
 */
router.get("/issuedBook/WithFine", (req, res) => {
    const allIssueUser = users.filter((each) => {
        if (each.issuedBook) {
            return each
        }

    })

    if (!allIssueUser) return res.status(400).json({
        success: false,
        message: "no issued books"
    })
    const getDateInDays = (data = "") => {
        let date
        if (data === "") {
            date = new Date()//current date
        } else {
            date = new Date(data)//date on bases of data variable
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24))// 60sec 60min 24 hours into 1000(cuz its in miliseconds)
        return days
    }


    const user = allIssueUser.map((each) => {
        const getSubType = (date) => {
            if (each.subscriptionType === "Basic") {
                date = date + 90
            } else if (each.subscriptionType === "Standard") {
                date = date + 180
            } else if (each.subscriptionType === "Premium") {
                date = date + 365
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
    const userWithFine = user.filter((each) => {
        if (each.fine == 0) {

        } else {
            return each
        }
    })
    const finalData = userWithFine.map((Each) => {
        return books.filter((ea) => {
            if (Each.issuedBook === ea.id) {
                const rex = {
                    ...ea,
                    fine: Each.fine

                }
                return rex
            }
        })
    })
    const fd = [...finalData]




    res.status(200).json({
        success: true,
        data: fd
    })

})
module.exports = router
