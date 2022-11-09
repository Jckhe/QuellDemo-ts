const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const citiesSchema = new Schema({
  name: { type: String, require: true},
  country: { type: String, require: true }
})
//albums
module.exports = mongoose.model('Cities', citiesSchema);