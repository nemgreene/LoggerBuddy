const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Scrum = new Schema({
  streamId: { type: ObjectId, required: true },
  columns: [],
  items: [],
  support: {},
});

module.exports = mongoose.model("Scrum", Scrum);
