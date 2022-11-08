const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID, buildSchema} = require('graphql')
const {gql} = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema')
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
  }
  })
})

//create graphQL fragment



const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    artist: {type: GraphQLString},
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





// const typeDefs = `
//   type Artist {
//     id: ID!
//     name: String!
//     songs: [Song!]
//     albums: [Album!]
//   }

//   type Album {
//     id: ID!
//     name: String!
//     artist: String!
//     songs: [Song!]
//   }

//   type Song {
//     id: ID!
//     name: String!
//     artist: Artist
//     albums: Album
//   }

//   type Query {
//     artist(name: String): Artist
//     album(name: String): Album
//     song(name: String): Song
//   }

// `

// const resolvers = {
//   Query: {
//     artist: async(parent, args, context, info) => {
//       const artist = await Artist.findOne({name: args.name});
//       return artist;
//     },
//     album: async(parent, args, context, info) => {
//       const album = await Album.findOne({name: args.name});
//       return album;
//     },
//     song: async(parent, args, context, info) => {
//       const song = await Songs.findOne({name: args.name});
//       return song;
//     }
//   },
//   Artist: {
//     songs: async(parent, args, context, info) => {
//       const songsList = await Songs.find({artist: parent.name});
//         return songsList;
//     },
//     albums: async(parent, args, context, info) => {
//       const albumList = await Songs.find({artist: parent.name});
//       return albumList;
//     }
//   },
//   Album: {
//     songs: async(parent, args, context, info) => {
//       const songsList = await Songs.find({album: parent.name});
//       return songsList;
//     }
//   },
//   Song: {
//     artist: async(parent, args, context, info) => {
//       const artist = await Artist.findOne({name: parent.artist});
//       return artist;
//     },
//     albums: async(parent, args, context, info) => {
//       const album = await Album.findOne({name: parent.album});
//       return album;
//   }
// }
// }

// const schema = makeExecutableSchema({ typeDefs, resolvers })

// module.exports = {schema}