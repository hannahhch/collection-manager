const mongoose = require('mongoose');

const postcardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true},
  dateReceived: Number,
  whoFrom: String,
  location: [{
    country: { type: String, required: true, default: 1},
    state: { type: String, required: true},
    city: { type: String}
  }]
})

const Postcard = mongoose.model("Postcard", postcardSchema);


module.exports = Postcard;
