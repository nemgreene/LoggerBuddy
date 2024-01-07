const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Scrum = new Schema({
  streamId: { type: ObjectId, required: true },
  columns: [],
  tasks: [],
  support: {},
});

module.exports = mongoose.model("Scrum", Scrum);
