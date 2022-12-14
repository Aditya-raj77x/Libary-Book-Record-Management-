const { userModel, bookModel } = require("../models");//importing models
//import dho
const IssuedBook = require("../dtos/book.dto");
//functions

exports.getAllBooks = async (req, res) => {
    const books = await bookModel.find();
    if (books.length === 0) return res.status(400).json({
        success: false,
        message: "No Book Found"
    });
    res.status(200).json({
        success: true,
        data: books
    })
};

exports.getanyBookById = async (req, res) => {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) return res.status(400).json({
        success: false,
        message: "books not found"
    });
    return res.status(200).json({
        success: true,
        data: book
    });
};

exports.getAllIssuedBooks=async (req,res)=>{
    const users=await userModel.find({
        issuedBook:{$exists:true}
    }).populate("issuedBook");

    const issueBooks=users.map((each)=> new IssuedBook(each));

    if (issueBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "no issued book at the moment"
        })
    }
    return res.status(200).json({
        success: true,
        data: issueBooks
    });   
};

exports.addNewBook=async(req, res) => {
    const { data } = req.body
    if (!data) return res.status(400).json({
        success: false,
        message: "no data provided"
    })
    
    await bookModel.create(data);
    const allbooks =await bookModel.find();
    
    

    
    return res.status(200).json({
        success: true,
        data: allbooks
    })

};

exports.updateBookById=async(req, res) => {
    const { id } = req.params
    const { data } = req.body
    

   const updateData=await bookModel.findOneAndUpdate({
       _id:id
   },data,{
       new:true
   })
    return res.status(200).json({
        success: true,
        data: updateData
    })
}

