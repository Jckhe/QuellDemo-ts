const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countriesSchema = new Schema({
  name: { type: String, require: true},
})
//albums
module.exports = mongoose.model('Countries', countriesSchema);