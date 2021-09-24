const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: String,
  description: String,
  createdBy: String,
  picture: String,
  books: [],
});

const List = mongoose.model("List", ListSchema);

module.exports = List;
