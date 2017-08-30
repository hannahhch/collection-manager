const mongoose = require('mongoose');

const postcardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true},
  whoFrom: String,
  location: [{
    country: { type: String, required: true, default: 1},
    state: { type: String, required: true},
  }]
})

const Postcard = mongoose.model("Postcard", postcardSchema);


module.exports = Postcard;
