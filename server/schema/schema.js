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
       const albumList =  await Album.find({artist: parent.name})
       return albumList;
      }
    }
  })
})

//create graphQL fragment



const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    artist: {
      type: ArtistType,
      async resolve(parent, args) {
        const albumArtist = await Artist.findOne({albums: {$elemMatch: {name: parent.name}}});
        return albumArtist;
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      async resolve(parent, args) {
        const songList = await Songs.find({album: parent.name});
        return songList;
      }
    }
  })
})



const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    artist: {
      type: ArtistType,
      async resolve(parent, args) {
        const songArtist = await Artist.findOne({songs: {$elemMatch: {name: parent.name}} });
        return songArtist;
      }
    },
    album: {
      type: AlbumType,
      async resolve(parent, args) {
        const albumList = await Album.findOne({songs: {$elemMatch: {name: parent.name}} });
        return albumList;
      }
    },
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
    TEST: {
      type: SongType,
      args: { name: {type: GraphQLString}},
      async resolve(parent, args) {
        const song = await Songs.find({name: args.name})
        return song;
      }
    }
  }
})






module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType]
})