const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const Postcard = require('./models/cards');
const DUPLICATE_RECORD_ERROR = 11000;

//const mongoURL = 'mongodb://localhost:27017/test'; //this is what I used locally

//this is was I use now for the app to work with heroku
const mongoURL = process.env.MONGODB_URI;

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

//render map page
app.get('/map', function(req,res){
  res.render("map");
})

//get the postcards ID, and render single_postcard page
app.get('(/:id/)', function(req,res){
    Postcard.findOne({_id:req.params.id}).then(function(cards){
      res.render('single_postcard', {cards:cards});
    })
});

//edit a card: get the card ID and render edit page
app.get("/:id/edit", function(req,res){
  let cards = Postcard.findOne({_id: req.params.id})
  .then(function(cards){
    res.render('edit_card', {cards:cards});
  })
});

//edit a card: Update the information
app.post("(/:id/edit)", function(req,res){
  //let cards = Postcard.findOne({_id: req.params.id})
  Postcard.updateOne(
    {_id: req.params.id},
    {
      "name":req.body.name,
      "image":req.body.image,
      "whoFrom":req.body.whoFrom,
      "location":[{
        "country": req.body.country,
        "state": req.body.state
      }]
    }
  )//redirect back home
  .then(function (update) {
    res.redirect('/');
  });
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
    "image":req.body.image,
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

//the listener has also been changed to work locally with heroku
app.listen(process.env.PORT || 8000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
