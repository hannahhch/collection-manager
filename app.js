const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const Postcard = require('./models/cards');
const DUPLICATE_RECORD_ERROR = 11000;

const mongoURL = 'mongodb://localhost:27017/test';

mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({ extended:true }));

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use('/static', express.static('static'));

//get new post card page
app.get('/new', function(req,res){
  res.render('new_card');
})

app.get('/map', function(req,res){
  res.render("map");
})

app.get('(/:id/)', function(req,res){
    Postcard.findOne({_id:req.params.id}).then(function(cards){
      res.render('single_postcard', {cards:cards});

    })
});

//home page, get all post cards and display them
app.get('/', function(req,res){
  let number = Postcard.count()
  let cards = Postcard.find()
  //deals with two promises and turns into an array. Results is array that has number and cards data
  Promise.all([number,cards]).then(function(results){
    //render things in the array with the square brackets
    res.render("index", {cards:results[1], number:results[0]});
  })
});




//create a new postcard with the following information
app.post('/new', function(req,res){
  Postcard.create({
    "name":req.body.name,
    "whoFrom":req.body.whoFrom,
    "location":[{
      "country": req.body.country,
      "state": req.body.state
    }]
  })
  //then redirect back home
  .then(function(postcard){
    res.redirect('/');
  })
  //error handling
  .catch(function(error){
    let errorMsg;
    if (error.code === DUPLICATE_RECORD_ERROR){
      errorMsg = `The postcard name "${req.body.name}" has already been used.`
    } else {
      errorMsg = "You have encountered an unknown error."
    }
    res.render("new_card", {errorMsg:errorMsg});
  })
});

//stay on same page, and find the postcard to delete.
app.post('/:id/delete', function(req,res){
  Postcard.deleteOne({_id:req.params.id}).then(function(postcard){
    res.redirect('/');
  })
});





module.exports = app;

app.listen(3000, function(){
  console.log("Listening on port 3000!")
});
