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



const Demo = memo(() => {
  const [ responseTimes, addResponseTimes ] = useState<number[]|[]>([])
  const [ errorAlerts, addErrorAlerts ] = useState<number[]>([]);
  const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ queryTypes, addQueryTypes ] = useState<string[]>([]);
  const [ maxDepth, setDepth ] = useState<string>('10');
  const [ maxCost, setCost ] = useState<string>('50');
  const [ isToggled, setIsToggled ] = useState<boolean>(false);


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
         addErrorAlerts={addErrorAlerts} 
         responseTimes={responseTimes} 
         addResponseTimes={addResponseTimes} 
         selectedQuery={selectedQuery} 
         setQueryChoice={setQueryChoice} 
         query={query} setQuery={setQuery} 
         queryTypes={queryTypes} 
         addQueryTypes={addQueryTypes}
        />
        <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
        <div className="demoRight">
          <CacheControlsServer setDepth={setDepth} setCost={setCost}/>
          <Divider orientation="horizontal" />
          <Graph responseTimes={responseTimes} selectedQuery={selectedQuery} queryTypes={queryTypes} />
          
        </div>
      </div>
      {responseTimes.map((el, i) => {
          return <SuccessfulQuery key={i}/>
        })}
      {errorAlerts.map((el, i) => {
          return <BadQuery key={i}/>
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
               addErrorAlerts={addErrorAlerts} 
               responseTimes={responseTimes} 
               addResponseTimes={addResponseTimes} 
               selectedQuery={selectedQuery} 
               setQueryChoice={setQueryChoice} 
               query={query} setQuery={setQuery} 
               queryTypes={queryTypes} 
               addQueryTypes={addQueryTypes}
              />
              <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
              <div className="demoRight">
                <CacheControls setDepth={setDepth} setCost={setCost}/>
                <Divider orientation="horizontal" />
                <Graph responseTimes={responseTimes} selectedQuery={selectedQuery} queryTypes={queryTypes} />
                
              </div>
            </div>
            {responseTimes.map((el, i) => {
                return <SuccessfulQuery key={i}/>
              })}
            {errorAlerts.map((el, i) => {
                return <BadQuery key={i}/>
              })}
          </div>
        )
      }
});

function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes }: QueryDemoProps) {
  // const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  // const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ response, setResponse ] = useState<string>('');
  const [ cacheHit, setCacheHit ] = useState<number>(0);
  const [ cacheMiss, setCacheMiss ] = useState<number>(0);
  

  function submitQuery() {
    console.log("Checking Query in Submit Query: ", typeof query)
    const startTime = (new Date()).getTime();
    Quellify('/graphql', query, { maxDepth, maxCost })
      .then(res => {
        // console.log('res[0]:', res[0])
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
        console.log("Error in fetch: ", err)
        addErrorAlerts((prev) => [...prev, 1])
      })
  }

  function resetGraph() {
    console.log('resetting the graph');
    addResponseTimes([]);
    clearLokiCache();
    fetch('/clearCache')
    .then((res) => console.log('Cleared Server Cache!'));
  }


  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQuery} />
      <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button>
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

function QueryDemoServer({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes }: QueryDemoProps) {
  // const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  // const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ response, setResponse ] = useState<string>('');
  const [ cacheHit, setCacheHit ] = useState<number>(0);
  const [ cacheMiss, setCacheMiss ] = useState<number>(0);
  

  function submitQueryServer() {
    console.log("Checking Query in Submit Query Server: ", typeof query);
    clearLokiCache();
    const startTime = (new Date()).getTime();
    Quellify('/graphql', query, { maxDepth, maxCost })
      .then(res => {
        // console.log('res[0]:', res[0])
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
        console.log("Error in fetch: ", err)
        addErrorAlerts((prev) => [...prev, 1])
      })

  //     const fetchOptions = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ query: query }),
  //     };

  // fetch('/graphql', fetchOptions)
  //   .then(res => res.json())
  //   .then(res => {
  //     const responseTime: number = (new Date()).getTime() - startTime;
  //     addResponseTimes([...responseTimes, responseTime]);
  //     setResponse(JSON.stringify(res, null, 2));
  //   })
  //   .catch((err) => {
  //     console.log("Error in fetch: ", err);
  //     addErrorAlerts((prev) => [...prev, 1]);
  //   })
  }

  function resetGraph() {
    console.log('resetting the graph');
    addResponseTimes([]);
    clearLokiCache();
    fetch('/clearCache')
    .then((res) => console.log('Cleared Server Cache!'));
  }


  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQueryServer} />
      <Button onClick={resetGraph} sx={{textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} size='medium' color='secondary' variant='contained'>Reset Graph</Button>
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


const CacheControls = ({ setDepth, setCost }: CacheControlProps) => {

  const clearClientCache = () => {
    return clearLokiCache();
  }

  return (
    <div className="cacheControlContainer">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Button sx={{ border: 'none', textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} onClick={clearClientCache} color="secondary" variant='contained'>Clear Client Cache</Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
      {/* <Limit setDepth={setDepth} setCost={setCost}/> */}
       {/* <StyledDiv>{'Max Depth: 10'}</StyledDiv>
       <StyledDiv>{'Max Cost: 50'}</StyledDiv> */}
      </Stack>
    </div>
  )
}

const CacheControlsServer = ({ setDepth, setCost }: CacheControlProps) => {

  const clearServerCache = () => {
    fetch('/clearCache')
      .then((res) => console.log('Cleared Server Cache!'))
  }

  return (
    <div className="cacheControlContainer">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Button sx={{ border: 'none', textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem'}} onClick={clearServerCache} color="secondary" variant='contained'>Clear Server Cache</Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
      <Limit setDepth={setDepth} setCost={setCost}/>
       {/* <StyledDiv>{'Max Depth: 10'}</StyledDiv>
       <StyledDiv>{'Max Cost: 50'}</StyledDiv> */}
      </Stack>
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
  padding: theme.spacing(0.55, 1.75),
  // border: '1px solid black',
  borderRadius: '5px',
  fontSmooth: 'always',
  color: 'white',
  // cursor: 'pointer',
  boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
}));

function Limit({ setDepth, setCost }: CacheControlProps) {
  return(
    <div>
      <StyledDiv style={{marginBottom: '10px'}}>
        <form>
          <label>Max Depth:</label>
          {/* each input will have onChange event handler that invokes function to update state */}
          <input 
          // style={{paddingLeft: '50%'}} 
          type="number" placeholder="10" onChange = {(e) => {setDepth(e.target.value)}}/>
        </form>
      </StyledDiv>
      <StyledDiv>
        <form>
          <label>Max Cost:</label>
          <input type="number" placeholder="50" onChange = {(e) => {setCost(e.target.value)}}/>
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
  addErrorAlerts: React.Dispatch<React.SetStateAction<number[]>>;
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  queryTypes: string[];
  addQueryTypes: React.Dispatch<React.SetStateAction<any[]>>;
  maxDepth: string;
  maxCost: string;
}

interface CacheControlProps {
  setDepth: (val: string) => void;
  setCost: (val: string) => void;
}


 



export default Demo;