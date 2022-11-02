const schema = require('./schema/schema.js');
const express = require('express');
const app = express();
const cors = require('cors');
// const { graphqlHTTP } = require('express-graphql');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const redis = require('redis');
const { graphql } = require('graphql');
const QuellCache = require('../quell-server/src/quell');
const quellCache = new QuellCache(schema, 6379, 3600);

app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

// (async () => {
//   try {
//     const client = redis.createClient({ socket: { host: '127.0.0.1', port: 6379 } });
//     client.on('connect', function() {
//       console.log('Connected To Redis');
//     })
//   } catch (err) {
//     console.error(err)
//   }
// })()







mongoose.connect(
  "mongodb+srv://quell:quell@cluster0.t8iquko.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to Bongoose")
)

const PORT = 3000;





app.use(express.static("../dist"));

//

app.use('/graphql', quellCache.costLimit, quellCache.query, (req, res) => {
  return res.status(200).send(res.locals.queryResponse);
});

// clear cache
app.get('/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use('/redis', quellCache.getRedisInfo({
  getStats: true,
  getKeys: true,
  getValues: true
}));


app.listen(3000, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
