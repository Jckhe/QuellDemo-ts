const { parse } = require('graphql/language/parser');
const determineType = require('./helpers/determineType');
const loki = require('lokijs');
const lokidb = new loki('client-cache');
let lokiCache = lokidb.addCollection('loki-client-cache', { disableMeta: true });


/*The IDCache is a psuedo-join table that is a JSON object in memory, 
that uses cached queries to return their location ($loki (lokiID)) from LokiCache.
i.e. {{JSONStringifiedQuery: $lokiID}} 
  const IDCache = {
  query1: $loki1,
  query2: $loki2,
  query3: $loki3
 };
 */
let IDCache = {};

const clearCache = () => {
  lokidb.removeCollection('loki-client-cache');
  lokiCache = lokidb.addCollection('loki-client-cache', { disableMeta: true });
  IDCache = {};
  console.log('Client cache has been cleared.');
};


/**
 * Quellify replaces the need for front-end developers who are using GraphQL to communicate with their servers
 * to write fetch requests. Quell provides caching functionality that a normal fetch request would not provide.
 *  @param {string} endPoint - The address to where requests are sent and processed. E.g. '/graphql'.
 *  @param {string} query - The graphQL query that is requested from the client
 */
async function Quellify(endPoint, query, costOptions) {
  const performFetch = async () => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query, costOptions: costOptions  }),
    };
    console.log("DA QUERY IN QUELLIFY: ", typeof query)
    const serverResponse = await fetch(endPoint, fetchOptions);
    console.log('serverResponse', serverResponse);
    let parsedData =  await serverResponse.json();
    parsedData = parsedData.queryResponse;
    console.log('parsedData:', parsedData);
    return parsedData;
  };
  
  // Create AST based on the input query using the parse method available in the graphQL library (further reading: https://en.wikipedia.org/wiki/Abstract_syntax_tree)
  const AST = parse(query);

  //find operationType using determineType
  const { operationType } = determineType(AST);

  // pass-through for queries and operations that QuellCache cannot handle
  if (operationType === 'unQuellable') {
    //All returns in an async function return promises by default, therefore we are returning a promise that will resolve from perFormFetch
    const parsedData = await performFetch();
    return parsedData;
  } else if (operationType === 'mutation') {
    // exectue initial query
    const parsedData = await performFetch();

    // clear caches
    clearCache();

    // return data
    return parsedData;
  } else {// if the request is query...
    
    // check IDCache with query, if query returns the $loki ID, find the results for searching the LokiDBCache
    //lokiCache to see if this call has a $loki associated with it. if so, retrieve and return it
    if (IDCache[query]) {
      console.log('id cache: ' , IDCache)
      console.log('CACHE HIT data exists in loki cache');

      // grab the $loki ID from the IDCache
      const queryID = IDCache[query];
      // grabs results from lokiCachi by $loki id
      const results = lokiCache.get(queryID);
      console.log('from line 86, results: ', results)
      return [results, true];
    }
    // if this call has not been made already, execute fetch request with original query
    else {
      //this is a data cache miss
      console.log('CACHE MISS data does not exist in loki cache');

      const parsedData = await performFetch();
      console.log('parsed:', parsedData.data);
      
      // add new data to lokiCache, and add $loki to IDcache
      const addedEntry = lokiCache.insert(parsedData.data);
      //add query to IDCache so that the query returns the $loki index
      IDCache[query] = addedEntry.$loki;
      console.log('from line 101, addedEntry: ', addedEntry)
      
      return [addedEntry, false];
    }
  }
}

module.exports = { Quellify , clearLokiCache: clearCache };