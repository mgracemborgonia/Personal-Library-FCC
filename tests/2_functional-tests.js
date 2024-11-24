/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const book_url = ("/api/books");
const book_url_invalid_id = ("/api/books/invalid_ID");
chai.use(chaiHttp);
let bookId;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post(book_url)
        .send({
          title: "book title"
        })
        .end((err, res) => {
          bookId = res.body._id;
          assert.deepEqual(
            res.status, 200,
            res.body.title, "book title"
          )
        })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post(book_url)
        .send({
          title: ""
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "missing required field title"
          )
        })
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get(book_url)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body, "array of books")
        })
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get(book_url_invalid_id)
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "no book exists"
          )
        })
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(book_url + bookId)
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.title, "book title"
          )
        })
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(book_url + bookId)
        .send({
          comment: "my comment"
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.comment, "my comment"
          )
        })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(book_url + bookId)
        .send({
          comment: ""
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "missing required field comment"
          )
        })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post(book_url_invalid_id)
        .send({
          comment: "my comment"
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "no book exists"
          )
        })
        done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(book_url + bookId)
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "delete successful"
          )
        })
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete(book_url_invalid_id)
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.text, "no book exists"
          )
        })
        done();
      });
    });
  });
});
