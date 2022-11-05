const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID} = require('graphql')
const Songs = require('../models/songsModel.js');
const Artist = require('../models/artistsModel.js');
const Album = require('../models/albumsModel.js');



const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    albums: { 
      type: new GraphQLList(AlbumType),
      async resolve(parent, args) {
        const albumList = await Album.find({artist: parent.name});
        return albumList;
      }
    },
    songs: {
      
    }
  })
})

//create graphQL fragment



const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    songs: { 
      type: new GraphQLList(SongType),
      async resolve(parent, args) {
        const songList = await Songs.find({album: parent.name});
        return songList;
      }
    },
    artist: {
      type: ArtistType,
      async resolve(parent, args) {
        const albumArtist = await Artist.findOne({albums: {$elemMatch: {name: parent.name}}});
        return albumArtist;
      }
    }
  })
})



const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    artist: { type: ArtistType },
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    song: {
      type: SongType,
      args: { name: {type: GraphQLString}},
      async resolve(parent, args) {
       const song =  Songs.findOne({name: args.name});
       return song;
      }
    },
    album: {
      type: AlbumType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const album = Album.findOne({name: args.name});
        return album;
      }
    },
    artist: {
      type: ArtistType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const artist = await Artist.findOne({name: args.name})
        return artist;
      }
    }
  }
})

const RootMutations = new GraphQLObjectType({
  name: 'RootMutationsType',
  fields: {
    addSong: {
      type: SongType,
      args: { name: {type: GraphQLString}, album: {type: GraphQLString}, artist: {type: GraphQLString}},
      async resolve(parent, args) {
        const song = await Songs.create({name: args.name, album: args.album, artist: args.artist})
        return song;
      }
    },
    // deleteSong {
    //   type: SongType,
    //   args: { name: {type: GraphQLString}},
    //   async resolve(parent, args) {
    // }
}
})






module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType]
})