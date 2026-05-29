// models/author.js
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number, // Fixed from Int to Number
  },
});

module.exports = mongoose.model("Author", schema);
