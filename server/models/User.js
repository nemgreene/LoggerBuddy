const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String,
  sessionCookie: String,
});

module.exports = mongoose.model("User", User);
