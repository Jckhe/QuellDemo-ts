const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//we need songs, artist, and albums
const songsSchema = new Schema({
  name: {type: String, required: true},
  artist: {type: String, required: true},
  album: {type: String, required: true},
})



module.exports = mongoose.model('Songs', songsSchema);