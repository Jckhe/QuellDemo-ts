import {Box, Divider, Stack, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField} from '@mui/material'
import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react'
import { QueryEditor } from './Editors'
import { querySamples } from './helperFunctions'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import demoHeader from '../assets/images/headers/QUELL-headers-demo w lines.svg'
import { Graph } from './Graph';
import { HitMiss } from './HitMiss'
import { SuccessfulQuery, BadQuery } from './Alert';
import { Quellify, clearLokiCache } from '../quell-client/src/Quellify.js';
import { styled } from '@mui/material/styles';
import { width } from '@mui/system';

const Demo = memo(() => {
  const [ responseTimes, addResponseTimes ] = useState<number[]|[]>([])
  const [ errorAlerts, addErrorAlerts ] = useState<string[]>([]);
  const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ queryTypes, addQueryTypes ] = useState<string[]>([]);
  const [ maxDepth, setDepth ] = useState<string>('10');
  const [ maxCost, setCost ] = useState<string>('50');
  const [ ipRate, setIPRate ] = useState<number>(22);
  const [ isToggled, setIsToggled ] = useState<boolean>(false);
  const [ response, setResponse ] = useState<string>('');
  const [ cacheHit, setCacheHit ] = useState<number>(0);
  const [ cacheMiss, setCacheMiss ] = useState<number>(0);

  useEffect(() => {
  }, [errorAlerts, responseTimes])

  function handleToggle(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsToggled(event.target.checked);
    console.log(isToggled);
  }

// Server
if (isToggled) {
  return (
    <div style={{width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
      <div id="scroll-demo" className="scrollpoint"><img src={demoHeader} id="demo-header"/>
        <Box>
          <FormControlLabel label='Server-side caching' control={
            <Switch 
              checked={isToggled} 
              onChange={handleToggle} 
            />} 
          />
        </Box>
      </div>
      <div className="demoContainer">
        {/* This div is to set a point slightly above the demo container for a natural scroll motion / point */}
        <QueryDemoServer 
         maxDepth={maxDepth}
         maxCost={maxCost} 
         ipRate={ipRate}
         addErrorAlerts={addErrorAlerts} 
         responseTimes={responseTimes} 
         addResponseTimes={addResponseTimes} 
         selectedQuery={selectedQuery} 
         setQueryChoice={setQueryChoice} 
         query={query} setQuery={setQuery} 
         queryTypes={queryTypes} 
         addQueryTypes={addQueryTypes}
         cacheHit={cacheHit}
         cacheMiss={cacheMiss}
         setCacheHit={setCacheHit}
         setCacheMiss={setCacheMiss}
        />
        <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
        <div className="demoRight">
          <CacheControlsServer setDepth={setDepth} setCost={setCost} setIPRate={setIPRate} addResponseTimes={addResponseTimes} cacheHit={cacheHit} cacheMiss={cacheMiss} setCacheHit={setCacheHit} setCacheMiss={setCacheMiss} />
          <Divider orientation="horizontal" />
          <Graph responseTimes={responseTimes} selectedQuery={selectedQuery} queryTypes={queryTypes} />
          
        </div>
      </div>
      {console.log('ERROR ALERTS >>>>> ', JSON.stringify(errorAlerts))}
      {responseTimes.map((el, i) => {
          return <SuccessfulQuery key={i}/>
        })}
      {errorAlerts.map((el, i) => {
        console.log('ERROR HERE >>>>> ', el);
          return <BadQuery errorMessage={el} key={i}/>
        })}
    </div>
  )
      }
      // Client
      else {
        return (
          <div style={{width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
            <div id="scroll-demo" className="scrollpoint"><img src={demoHeader} id="demo-header"/>
              <Box>
                <FormControlLabel label='Server-side caching' control={
                  <Switch 
                    checked={isToggled} 
                    onChange={handleToggle} 
                  />} 
                />
              </Box>
            </div>
            <div className="demoContainer">
              {/* This div is to set a point slightly above the demo container for a natural scroll motion / point */}
              <QueryDemo 
               maxDepth={maxDepth}
               maxCost={maxCost} 
               ipRate={ipRate}
               addErrorAlerts={addErrorAlerts} 
               responseTimes={responseTimes} 
               addResponseTimes={addResponseTimes} 
               selectedQuery={selectedQuery} 
               setQueryChoice={setQueryChoice} 
               query={query} setQuery={setQuery} 
               queryTypes={queryTypes} 
               addQueryTypes={addQueryTypes}
               cacheHit={cacheHit}
               cacheMiss={cacheMiss}
               setCacheHit={setCacheHit}
               setCacheMiss={setCacheMiss}
              />
              <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
              <div className="demoRight">
                <CacheControls setDepth={setDepth} setCost={setCost} setIPRate={setIPRate} addResponseTimes={addResponseTimes}cacheHit={cacheHit} cacheMiss={cacheMiss} setCacheHit={setCacheHit} setCacheMiss={setCacheMiss}/>
                <Divider orientation="horizontal" />
                <Graph responseTimes={responseTimes} selectedQuery={selectedQuery} queryTypes={queryTypes} />
              </div>
            </div>
            {responseTimes.map((el, i) => {
                return <SuccessfulQuery key={i}/>
              })}
            {errorAlerts.map((el, i) => {
                return <BadQuery errorMessage={el} key={i}/>
              })}
          </div>
        )
      }
});

function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, ipRate, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes, cacheHit, cacheMiss, setCacheHit, setCacheMiss }: QueryDemoProps) {
  const [ response, setResponse ] = useState<string>('');
  
  function submitQuery() {
    console.log("Checking Query in Submit Query: ", typeof query)
    const startTime = (new Date()).getTime();
    Quellify('/graphql', query, { maxDepth, maxCost, ipRate })
      .then(res => {
        console.log('NEW RESPONSE >>>>> ', res);
        console.log('res[0]:', res[0]);
      const responseTime: number = (new Date()).getTime() - startTime;
      addResponseTimes([...responseTimes, responseTime]);
      const queryType: string = selectedQuery;
      addQueryTypes([...queryTypes, queryType])
      setResponse(JSON.stringify(res[0], null, 2));

      if (res[1] === false) {
        setCacheMiss(cacheMiss + 1);
        
      } else if (res[1] === true) {
        setCacheHit(cacheHit + 1);
      }
    })
    .catch((err) => {
      err = JSON.stringify(err);
      console.log("Error in fetch: ", err);
      err = 'Invalid query :('
      addErrorAlerts((prev) => [...prev, err]);
    })
  }

  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQuery} />
      {/* <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button> */}
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <h3>See your query results: </h3>
      <div style={{width: '85%', border: 'none',  overflow: 'hidden', borderRadius: '5px'}}> 
        <div id="responseContainer" >
          <TextField
          multiline={true}
          fullWidth={true}
          sx={{border: '1px solid white', borderStyle: 'inset'}}
          inputProps={{style: {fontSize: '0.9rem', width: "100%", backgroundColor: '#474f57', padding: '10px', color: 'white', fontFamily: 'Monaco'}}}
          rows="50"
          value={response}
          >
          </TextField>
        </div>
      </div>
      <div  style={{border: '3px solid white', marginTop: '1em',  borderRadius: '15px'}}>
        <HitMiss cacheHit={cacheHit} cacheMiss={cacheMiss} />
      </div>
    </div>
  )
}

function QueryDemoServer({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, ipRate, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes, cacheHit, cacheMiss, setCacheHit, setCacheMiss }: QueryDemoProps) {
  const [ response, setResponse ] = useState<string>('');
  
  function submitQueryServer() {
    console.log("Checking Query in Submit Query Server: ", typeof query);
    clearLokiCache();
    const startTime = (new Date()).getTime();

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query, costOptions: { maxDepth, maxCost, ipRate } }),
    };

    let resError: string;

  fetch('/graphql', fetchOptions)
    .then(res => res.json())
    .then(res => {
      console.log('RES LOCALS >>>>> ', res);
      resError = res;
      const responseTime: number = (new Date()).getTime() - startTime;
      addResponseTimes([...responseTimes, responseTime]);
      setResponse(JSON.stringify(res.queryResponse.data, null, 2));
      if (res.queryResponse.cached === true) setCacheHit(cacheHit + 1);
      else setCacheMiss(cacheMiss + 1);
    })
    .catch((err) => {
      err = JSON.stringify(err);
      console.log("Error in fetch: ", err);
      err = resError;
      addErrorAlerts((prev) => [...prev, err]);
    })
  }

  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQueryServer} />
      {/* <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button> */}
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <h3 style={{paddingBottom: '1rem'}}>See your query results: </h3>
      <div style={{width: '85%', border: 'none', marginTop: '-1.5em', overflow: 'hidden', borderRadius: '5px'}}>
        <div id="responseContainer" >
          <TextField
          multiline={true}
          fullWidth={true}
          sx={{border: '1px solid white', borderStyle: 'inset'}}
          inputProps={{style: {fontSize: '0.9rem', width: "100%", backgroundColor: '#474f57', padding: '10px', color: 'white', fontFamily: 'Monaco'}}}
          rows="50"
          value={response}
          >
          </TextField>
        </div>
      </div>
      <div  style={{
        border: '3px solid white', 
        marginTop: '1em',  borderRadius: '15px'}}>
        <HitMiss cacheHit={cacheHit} cacheMiss={cacheMiss} />
      </div>
    </div>
  )
}

interface DemoControls {
  selectedQuery: string,
  setQueryChoice: Dispatch<SetStateAction<string>>;
  submitQuery: () => void;
}

const DemoControls = ({selectedQuery, setQueryChoice, submitQuery}: DemoControls) => {

  return (
    <div className="dropDownContainer" >
      <h3>Select a query to test: </h3>
         <Box sx={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
          <QuerySelect setQueryChoice={setQueryChoice} selectedQuery={selectedQuery}/>     
         </Box>
         {/* SUBMIT QUERY BUTTON */}
         <Button endIcon={<ForwardRoundedIcon />} sx={{ marginBottom: '12px', border: 'none', maxHeight: 35, minWidth: 100 , maxWidth: 160 }} onClick={() => submitQuery()} size='medium' color='secondary' variant='contained'>Query</Button>
    </div>
  )
}

const CacheControls = ({ setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, cacheHit, cacheMiss }: CacheControlProps) => {

  function resetGraph() {
    console.log('resetting the graph');
    addResponseTimes([]);
    clearLokiCache();
    setCacheHit(cacheHit = 0);
    setCacheMiss(cacheMiss = 0);
  }

  const clearClientCache = () => {
    return clearLokiCache();
  }

  return (
    <div className="cacheControlContainer">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Button sx={{ border: 'none', textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} onClick={clearClientCache} color="secondary" variant='contained'>Clear Client Cache</Button>
        <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button>      
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
      </Stack>
    </div>
  )
}

const CacheControlsServer = ({ setDepth, setCost, setIPRate, addResponseTimes, cacheHit, cacheMiss, setCacheHit, setCacheMiss }: CacheControlProps) => {

  function resetGraph() {
    console.log('resetting the graph');
    addResponseTimes([]);
    clearLokiCache();
    fetch('/clearCache')
    .then((res) => console.log('Cleared Server Cache!'));
    setCacheHit(cacheHit = 0);
    setCacheMiss(cacheMiss = 0);
  }

  const clearServerCache = () => {
    fetch('/clearCache')
      .then((res) => console.log('Cleared Server Cache!'))
  }

  return (
    <div className="cacheControlContainer">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Button sx={{ border: 'none', textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem'}} onClick={clearServerCache} color="secondary" variant='contained'>Clear Server Cache</Button>
        <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button>
      </Stack>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
      }}>
        <Limit setDepth={setDepth} setCost={setCost} setIPRate={setIPRate} addResponseTimes= {addResponseTimes} cacheHit={cacheHit} cacheMiss={cacheMiss} setCacheHit={setCacheHit} setCacheMiss={setCacheMiss}/>
      </div>
    </div>
  )
}

//Query Dropdown Menu 
function QuerySelect({setQueryChoice, selectedQuery} : BasicSelectProps) {

  const handleChange = (event: SelectChangeEvent) => {
    //this state is controlled by the demoControls aka the parent component
    setQueryChoice(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 250, marginLeft: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Query</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedQuery}
          defaultValue={selectedQuery}
          label="Query"
          onChange={handleChange}
        >
          <MenuItem value={'2depth'}>2-Depth</MenuItem>
          <MenuItem value={'3depth'}>3-Depth Country and Cities</MenuItem>
          <MenuItem value={'costly'}>Costly</MenuItem>
          <MenuItem value={'nested'}>Nested</MenuItem>
          <MenuItem value={'fragment'}>Fragment</MenuItem>
          <MenuItem value={'mutation'}>Mutation</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

const StyledDiv = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '5px',
  fontSmooth: 'always',
  color: 'white',
  boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
}));

function Limit({ setDepth, setCost, setIPRate }: CacheControlProps) {
  return(
    <div>
      <StyledDiv style={{marginBottom: '10px'}}>
        <form>
          <label>Max Depth: </label>
          <input 
          style={{width: '20%', margin: '0px, 0px, 0px, 20%', backgroundColor: '#999', color: '#FFF'}} 
          type="number" placeholder="10" onChange = {(e) => {setDepth(e.target.value)}}/>
        </form>
      </StyledDiv>
      <StyledDiv style={{marginBottom: '10px'}} >
        <form>
          <label>Max Cost:</label>
          <input 
          style={{width: '20%', margin: '0px, 0px, 0px, 20%', backgroundColor: '#999', color: '#FFF'}}
          type="number" placeholder="50" onChange = {(e) => {setCost(e.target.value)}}/>
        </form>
      </StyledDiv>
      <StyledDiv>
        <form>
          <label>Requests /s:</label>
          <input 
          style={{width: '20%', margin: '0px, 0px, 0px, 20%', backgroundColor: '#999', color: '#FFF'}}
          type="number" placeholder="22" onChange = {(e) => {setIPRate(+e.target.value)}}/>
        </form>
      </StyledDiv>
    </div>
  )
}

interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
}

interface QueryDemoProps {
  responseTimes: number[];
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  addErrorAlerts: React.Dispatch<React.SetStateAction<string[]>>;
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  queryTypes: string[];
  addQueryTypes: React.Dispatch<React.SetStateAction<any[]>>;
  maxDepth: string;
  maxCost: string;
  ipRate: string;
  cacheHit: number;
  cacheMiss: number;
  setCacheHit: Dispatch<SetStateAction<number>>
  setCacheMiss: Dispatch<SetStateAction<number>>
}

interface CacheControlProps {
  setDepth: (val: string) => void;
  setCost: (val: string) => void;
  setIPRate: (val: number) => void;
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  cacheHit: number;
  cacheMiss: number;
  setCacheHit: Dispatch<SetStateAction<number>>
  setCacheMiss: Dispatch<SetStateAction<number>>
}

export default Demo;