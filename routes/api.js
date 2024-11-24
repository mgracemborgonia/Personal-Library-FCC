/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
require('dotenv').config();
const mongo_uri = process.env.DB;
mongoose.connect(mongo_uri);
const {Schema} = mongoose;
const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String],
  commentcount: Number
});
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({});
      if(books){
        const formatBooks = books.map(b => ({
          _id: b._id,
          title: b.title,
          comments: b.comments,
          commentcount: b.comments.length
        }))
        res.json(formatBooks);
      }else{
        res.json([]);
        return;
      }
    })
    
    .post(async function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if(title){
        const newBook = new Book({
          title: title,
          comments: []
        });
        try{
          const book = await newBook.save();
          const obj = {
            _id: book._id,
            title: book.title
          }
          res.json(obj);
        }catch(err){
          console.log(err)
        }
      }else{
        res.send("missing required field title");
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try{
        const deleteBooks = await Book.deleteMany();
        console.log(`${deleteBooks} was deleted.`);
        res.send("complete delete successful");
      }catch(err){
        console.log(err);
      }
    });

  
  app.route('/api/books/:id')
    .get(async function (req, res){
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookid = req.params.id;
      try{
        const book = await Book.findById(bookid);
        const obj = {
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        }
        res.json(obj);
      }catch(err){
        console.log(err);
        res.send("no book exists");
      }
    })
    
    .post(async function(req, res){
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(comment){
        try{
          const book = await Book.findById(bookid);
          book.comments.push(comment);
          const book_comment = await book.save();
          const obj = {
            _id: book_comment._id,
            title: book_comment.title,
            comments: book_comment.comments,
            commentcount: book_comment.comments.length
          }
          res.json(obj);
        }catch(err){
          console.log(err);
          res.send("no book exists");
        }
      }else{
        res.send("missing required field comment");
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'delete successful'
      let bookid = req.params.id;
      try{
        const deleteBooks = await Book.findByIdAndDelete(bookid);
        console.log(`${deleteBooks} was deleted.`);
        if(deleteBooks){
          res.send("delete successful");
        }else{
          res.send("no book exists");
        }
      }catch(err){
        console.log(err);
        res.send("no book exists");
      }
    });
};
