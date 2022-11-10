import {Box, Divider, Stack, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, Alert, Grow} from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { QueryEditor, ResponseEditor } from './Editors'
import { querySamples } from './helperFunctions'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import demoHeader from '../assets/images/headers/QUELL-headers-demo w lines.svg'
import { Graph } from './Graph';
import { SuccessfulQuery, BadQuery } from './Alert';
import { Quellify, clearLokiCache } from '../quell-client/src/Quellify.js';
import { styled } from '@mui/material/styles';




export function Demo() {
  const [ responseTimes, addResponseTimes ] = useState<number[]|[]>([])
  const [ errorAlerts, addErrorAlerts ] = useState<number[]>([]);


  useEffect(() => {
  }, [errorAlerts, responseTimes])


  return (
    <div style={{width: '100%', flexDirection: 'column', justifyContent: 'center'}}>
      <div id="scroll-demo" className="scrollpoint"><img src={demoHeader} id="demo-header"/></div>
      <div className="demoContainer">
        {/* This div is to set a point slightly above the demo container for a natural scroll motion / point */}
        <QueryDemo addErrorAlerts={addErrorAlerts} responseTimes={responseTimes} addResponseTimes={addResponseTimes} />
        <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
        <div className="demoRight">
          <CacheControls />
          <Divider orientation="horizontal" />
          <Graph responseTimes={responseTimes} />
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

function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes}: QueryDemoProps) {
  const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ response, setResponse ] = useState<string>('');
  

  function submitQuery() {
    console.log("Checking Query in Submit Query: ", typeof query)
    const startTime = (new Date()).getTime();
    Quellify('http://localhost:3000/graphql', query)
      .then(res => {
      const responseTime: number = (new Date()).getTime() - startTime;
      addResponseTimes([...responseTimes, responseTime]);
      setResponse(JSON.stringify(res, null, 2))
    })
      .catch((err) => {
        console.log("Error in fetch: ", err)
        addErrorAlerts((prev) => [...prev, 1])
      })
  }




  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQuery} />
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <div style={{width: '85%', border: '3px solid white', marginTop: '-1.5em', overflow: 'hidden', borderRadius: '15px'}}>
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
         <Box sx={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
          <QuerySelect setQueryChoice={setQueryChoice} selectedQuery={selectedQuery}/>     
         </Box>
         {/* SUBMIT QUERY BUTTON */}
         <Button endIcon={<ForwardRoundedIcon />} sx={{ marginBottom: '12px', border: 1, maxHeight: 35, minWidth: 100 , maxWidth: 160 }} onClick={() => submitQuery()} size='medium' color='secondary' variant='contained'>Query</Button>
    </div>
  )
}


const CacheControls = () => {

  const clearServerCache = () => {
    fetch('/clearCache')
      .then((res) => console.log('Cleared Server Cache!'))
  }

  const clearClientCache = () => {
    return clearLokiCache();
  }



  return (
    <div className="cacheControlContainer">
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Button sx={{ border: 1, textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem' }} onClick={clearClientCache} color="secondary" variant='contained'>Clear Client Cache</Button>
        <Button sx={{ border: 1, textAlign: 'center', minHeight: '40px', maxHeight:"40px", fontSize: '.85rem'}} onClick={clearServerCache} color="secondary" variant='contained'>Clear Server Cache</Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
       <StyledDiv>{'Max Depth: 10'}</StyledDiv>
       <StyledDiv>{'Max Cost: 50'}</StyledDiv>
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
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.55, 1.75),
  border: '1px solid black',
  borderRadius: '5px',
  fontSmooth: 'always',
  cursor: 'pointer',
  boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
}));



interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
}


interface QueryDemoProps {
  responseTimes: number[];
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  addErrorAlerts: React.Dispatch<React.SetStateAction<number[]>>;
}


