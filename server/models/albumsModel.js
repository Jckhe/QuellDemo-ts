const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  name: { type: String, require: true},
  songs: [{name: String, artist: String, album: String}],
  artist: { type: String, require: true}
})
//albums
module.exports = mongoose.model('Album', albumSchema);