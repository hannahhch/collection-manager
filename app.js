const express = require('express');
const app = express();
const path = require('path');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const Postcard = require('./models/cards');
mongoose.connect('mongodb://localhost:27017/test', {useMongoClient: true});
mongoose.Promise = require('bluebird');

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');



app.get('/', function(req,res){
    Postcard.find({}).then(function(cards){
      res.render("index", {cards})
  })
});


app.listen(3000, function(){
  console.log("Listening on port 3000!")
});
