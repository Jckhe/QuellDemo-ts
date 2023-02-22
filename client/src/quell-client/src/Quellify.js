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
    const serverResponse = await fetch(endPoint, fetchOptions);
    const parsedData =  await serverResponse.json();
    return parsedData;
  };

  // Create AST based on the input query using the parse method available in the graphQL library (further reading: https://en.wikipedia.org/wiki/Abstract_syntax_tree)
  const AST = parse(query);

  //find operationType, proto using determineType
  const { operationType, proto } = determineType(AST);

  // pass-through for queries and operations that QuellCache cannot handle
  if (operationType === 'unQuellable') {
    //All returns in an async function return promises by default, therefore we are returning a promise that will resolve from perFormFetch
    const parsedData = await performFetch();
    return parsedData;
  } else if (operationType === 'mutation') {

    // assign mutationType
    let mutationType = Object.keys(proto)[0];
    // check for key words in the type
    if ( //add mutation
      mutationType.includes('add') ||
      mutationType.includes('new') ||
      mutationType.includes('create') ||
      mutationType.includes('make')
    ) {
      // execute initial query
      const parsedData = await performFetch();
      // clear cache so the next query will include mutation
      clearCache();
      // return data
      return [parsedData];
      
    } else if (//if query is update or delete mutation
        mutationType.includes('delete') ||
        mutationType.includes('remove')
      ) {
        //assign delete request method
        let fetchOptions = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: query, costOptions: costOptions }),
        };
        // execute initial query
        const serverResponse = await fetch(endPoint, fetchOptions);
        const parsedData = await serverResponse.json();
        // clear caches
        clearCache();
        // return data
        return [parsedData];
      } else if (//if query is update mutation
          mutationType.includes('update')
        ) {
          // execute initial query
          const serverResponse = await performFetch();
          const parsedData = await serverResponse.json();
          // clear caches
          clearCache();
          // return data
          return [parsedData];
        } 
 
  } else {// if the request is a query
    
    //check IDCache with query, if query returns the $loki ID, find the results for searching the LokiDBCache
    //lokiCache to see if this call has a $loki associated with it. if so, retrieve and return it
    if (IDCache[query]) {
      // grab the $loki ID from the IDCache
      const queryID = IDCache[query];
      // grab results from lokiCache by $loki ID
      const results = lokiCache.get(queryID);
      //second element is boolean for whether data can be found in lokiCache
      return [results, true];
    } else { // if this query has not been made already, execute fetch request with query
        const parsedData = await performFetch();
        // add new data to lokiCache
        const addedEntry = lokiCache.insert(parsedData.data);
        //add query $loki ID to IDcache at query key
        IDCache[query] = addedEntry.$loki;
        //return data 
        return [addedEntry, false];
      }
    }
}

module.exports = { Quellify , clearLokiCache: clearCache };