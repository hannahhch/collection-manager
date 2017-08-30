
//mongoose schema
const mongoose = require('mongoose');

const postcardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true},
  whoFrom: String,
  location: [{
    country: { type: String},
    state: { type: String},
  }]
})

const Postcard = mongoose.model("Postcard", postcardSchema);


module.exports = Postcard;
