const schema = require('./schema/schema.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const QuellCache = require('../quell-server/src/quell');
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

app.use('/graphql', quellCache.rateLimiter, quellCache.costLimit, quellCache.depthLimit, quellCache.query, (req, res) => {
  return res.status(200).send(res.locals);
});

app.get('/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use('/redis', quellCache.getRedisInfo({
  getStats: false,
  getKeys: true,
  getValues: true
}));

app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.log);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
