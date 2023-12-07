const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Post = new Schema({
  streamId: { type: ObjectId, required: true },
  streamName: { type: String, required: true },
  datePosted: { type: Date, required: true },
  h1: { type: String, required: true },
  h2: String,
  body: { type: String, required: true },
  images: [String],
  links: [String],
  color: { type: String, required: true },
  cut: String,
});

module.exports = mongoose.model("Post", Post);
