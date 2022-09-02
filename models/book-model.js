const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        publisher: {
            type: String,
            required: true//by default its false 
        },
    },
    {
        timestamps: true//IT WILL CONTAIN THE DATE AND TIME ON WGICH IT WAS ADDED
    }
);

module.exports = mongoose.model("Book", bookSchema);//this will be saved as books in small leter and pular (s)
