import {Box, Divider, Stack, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, Alert, Grow} from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { QueryEditor, ResponseEditor } from './Editors'
import { querySamples } from './helperFunctions'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import demoHeader from '../assets/images/headers/QUELL-headers-demo w lines.svg'
import { makeStyles } from '@mui/styles';
import { ClassNames } from '@emotion/react';
import { Graph } from './Graph';
import { Quellify, clearLokiCache } from '../quell-client/src/Quellify.js';


export function Demo({toggleRenderStatus}: DemoProps) {
  const [ responseTimes, addResponseTimes ] = useState<number[]|[]>([])

  useEffect(() => {
    if (responseTimes.length > 1) {
      toggleRenderStatus(true)
    }
  }, [responseTimes])


  return (
    <div style={{width: '100%', flexDirection: 'column', justifyContent: 'center'}}>
      <div id="scroll-demo" className="scrollpoint"><img src={demoHeader} id="demo-header"/></div>
      <div className="demoContainer">
        {/* This div is to set a point slightly above the demo container for a natural scroll motion / point */}
        <QueryDemo toggleRenderStatus={toggleRenderStatus} responseTimes={responseTimes} addResponseTimes={addResponseTimes} />
        <Divider sx={{zIndex: '50'}} flexItem={true} orientation="vertical" />
        <div className="demoRight">
          <CacheControls />
          <Divider orientation="horizontal" />
          <Graph responseTimes={responseTimes} />
        </div>
      </div>
    </div>
  )
}

function QueryDemo({toggleRenderStatus, responseTimes, addResponseTimes}: QueryDemoProps) {
  const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  const [ queryStatus, setQueryStatus ] = useState<number>(0);
  const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ response, setResponse ] = useState<string>('');
  

  function submitQuery() {

    const startTime = (new Date()).getTime();
    Quellify('http://localhost:3000/graphql', query)
      .then(res => {
      console.log('checking res ', res);
      const responseTime: number = (new Date()).getTime() - startTime;
      addResponseTimes([...responseTimes, responseTime]);
      toggleRenderStatus(true)
      setResponse(JSON.stringify(res, null, 2))
    })
  }




  return (
    <div spellCheck='false' className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQuery} />
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <div style={{width: '85%', border: '3px solid white', marginTop: -'2em', overflow: 'hidden', borderRadius: '15px'}}>
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
        <Button sx={{ border: 1 }} onClick={clearClientCache} color="secondary" variant='contained'>Clear Client Cache</Button>
        <Button href={"#demoContainer"} sx={{ border: 1 }} color="secondary" variant='contained'>Clear Server Cache</Button>
      </Stack>
    </div>
  )
}






//Query Dropdown Menu 
export default function QuerySelect({setQueryChoice, selectedQuery} : BasicSelectProps) {

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
          <MenuItem value={'costly'}>Costly</MenuItem>
          <MenuItem value={'nested'}>Nested</MenuItem>
          <MenuItem value={'fragment'}>Fragment</MenuItem>
          <MenuItem value={'mutation'}>Mutation</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}



interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
}


interface QueryDemoProps {
  responseTimes: number[];
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  toggleRenderStatus: React.Dispatch<React.SetStateAction<boolean>>;
}


interface requestData {
  request: number;
  time: number;
}


interface DemoProps {
  toggleRenderStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

//alert comp
// // <Grow
// in={queryStatus}
// style={{ transformOrigin: '0 0 0' }}
// {...(queryStatus ? { timeout: 250 } : {})}
// >
// <Alert sx={{border: 0.5, height: 35, width: 175, overflowY: 'hidden', marginTop: 1.5, position: 'aboslute', overflow:"hidden"}} severity="success">Successful Query!</Alert>
// </Grow>


// Clear Client/Server Cache 
// <Stack sx={{width: '40%', position: 'absolute', display: 'flex', flexDirection: 'column', paddingLeft: '1.5%', alignItems:"center", zIndex: "3", right: 0, top: 20}}>
          
//           <Button sx={{ marginBottom: '3px', fontSize: '.6rem', border: 1, maxHeight:"30px", minWidth: 150, maxWidth: 160}} color='secondary' variant='contained' size='small' >Clear Client Cache</Button>
//           <Button sx={{ fontSize: '.6rem', border: 1, maxHeight:"30px" ,minWidth: 150, maxWidth: 160}} variant='contained' color='secondary' size='small'>Clear Server Cache</Button>
//     </Stack>
