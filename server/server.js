const schema = require('./schema/schema.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
// const schema = makeExecutableSchema({typeDefs, resolvers});
const QuellCache = require('../quell-server/src/quell');
// const quellCache = new QuellCache(schema, 13680, 3600);
const quellCache = new QuellCache(schema, 13680, 3600);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());



mongoose
  .connect("mongodb+srv://quello:quello@cluster0.t8iquko.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to BongoDB'))
  .catch(err => console.log(err))


const PORT = process.env.PORT || 3000;



app.use(express.static("./dist"));

//

app.use('/graphql', quellCache.costLimit, quellCache.depthLimit, quellCache.query, (req, res) => {
  if (res.locals.queryErr) return res.status(200).json(res.locals.queryErr);
  else return res.status(200).send(res.locals.queryResponse);
});

// clear cache
app.get('/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use('/redis', quellCache.getRedisInfo({
  getStats: false,
  getKeys: true,
  getValues: true
}));


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
