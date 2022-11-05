import {Box, Divider, Stack, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, Alert, Grow} from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { QueryEditor, ResponseEditor } from './Editors'
import { querySamples } from './helperFunctions'


export function Demo() {
  return (
    <>
      <div id={"demoContainer"} className="demoContainer">
        <QueryDemo />
        <Divider  orientation="vertical" />
        <RightSide />
      </div>
    </>
  )
}

function QueryDemo() {
  const [ selectedQuery, setQueryChoice ] = useState<string>('2depth');
  const [ queryStatus, setQueryStatus ] = useState<number>(0);
  const [ query, setQuery ] = useState<string>(querySamples[selectedQuery]);
  const [ response, setResponse ] = useState<string>('');

  function submitQuery() {
    fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Accept': "application/json, text/plain",
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({query: query})
        })
    .then(res => res.json())
    .then(data => {
      setResponse(JSON.stringify(data))
    })
  }

  return (
    <div className="demoLeft"> 
      <DemoControls selectedQuery={selectedQuery} setQueryChoice={setQueryChoice} submitQuery={submitQuery} />
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <ResponseEditor response={response} />
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
         <Button sx={{ marginBottom: '12px', border: 1, maxHeight: 35, minWidth: 100 , maxWidth: 160 }} onClick={() => submitQuery()} size='medium' color='secondary' variant='contained'>Query</Button>
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


function RightSide() {
  return (
    <div className="demoRight"> 
      <h2></h2>
    </div>
  )
}

interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
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
