const schema = require('./schema/schema.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const { graphql } = require('graphql');
// const schema = makeExecutableSchema({typeDefs, resolvers});
const QuellCache = require('../quell-server/src/quell');
const quellCache = new QuellCache(schema, 6379, 3600);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());


mongoose
  .connect("mongodb+srv://quello:quello@cluster0.t8iquko.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to BongoDB'))
  .catch(err => console.log(err))


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
