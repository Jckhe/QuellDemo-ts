const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID, buildSchema, GraphQLError} = require('graphql')
const Songs = require('../models/songsModel.js');
const Artist = require('../models/artistsModel.js');
const Album = require('../models/albumsModel.js');
const Attractions = require('../models/attractionsModel.js');
const Cities = require('../models/citiesModel.js');
const Countries = require('../models/countriesModel.js');


//TYPE DEFS
//THIS IS JUST ALL MOCK DATA AND MOCK TYPES
//ALTERNATIVELY IN THE RESOLVER CHOOSE THE DB OF YOUR LIKING
//WE USED MONGODB FOR TESTING PURPOSES BUT PSQL MAYBE BETTER!

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


const AttractionsType = new GraphQLObjectType({
  name: 'Attractions',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    city: {type: GraphQLString},
    country: {
      type: CountryType,
      async resolve(parent, args) {
        const city = await Cities.findOne({city: parent.city});
        const country = await Countries.findOne({country: city.country});
        return country;;
      }
    }
  })
})

const CityType = new GraphQLObjectType({
  name: 'City',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    country: { type: GraphQLString}, 
    attractions: {
      type: new GraphQLList(AttractionsType),
      async resolve(parent, args) {
        const attractions = await Attractions.find({city: parent.name});
        return attractions;
      }
    }
  })
})


const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString},
    cities: {
      type: new GraphQLList(CityType),
      async resolve(parent, args) {
        const citiesList = await Cities.find({country: parent.name});
        return citiesList;
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
    },
    country: {
      type: CountryType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const country = await Countries.findOne({name: args.name})
        return country;
      }
    },
    city: {
      type: CityType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const city = await Cities.findOne({name: args.name})
        return city;
      }
    },
    attractions: {
      type: AttractionsType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const attractions = await Attractions.findOne({name: args.name})
        return attractions;
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
    addAttraction: {
      type: AttractionsType,
      args: {name: {type: GraphQLString}, city: {type: GraphQLString}},
      async resolve(parent, args) {
        const checkCity = await Cities.findOne({name: args.city})
        if (checkCity) {
          const newAttraction = await Attractions.create({name: args.name, city: args.city})
          return newAttraction;
        }
         else {
          throw new Error(
            `City not found in database, add city and country first.`,
            {
              code: "COST_LIMIT_EXCEEDED",
              http: {status: 406}
            })
        }
      }
    },
    addCity: {
      type: CityType,
      args: {name: {type: GraphQLString}, country: {type: GraphQLString}},
      async resolve(parent, args) {
        const checkCountry = await Countries.findOne({name: args.country})
        if (checkCountry) {
          const newCity = await Cities.create({name: args.name, city: args.city})
          return newCity;
        }
      }
    },
    addCountry: {
      type: CountryType,
      args: {name: {type: GraphQLString}},
      async resolve(parent, args) {
        const country = await Countries.create({name: args.name})
        return country;
      }
    }
}
})






module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType]
})
