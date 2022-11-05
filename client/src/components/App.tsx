import '../stylesheets/App.css'
import React, { useState, useEffect } from 'react';
import {Button, Stack, Divider} from '@mui/material';
import { Navbar } from './Navbar';
import { Demo } from './Demo';
import { Features } from './Features';


function App() {
  const [renderFx, toggleRenderFx] = useState<String>('unrendered')




  //runs once on render, then procs the useState for rendered to change to renderedLogo
  //these two strings are ID's in our CSS.
  useEffect(() => {
    setTimeout(() => {
      toggleRenderFx('rendered')
    }, 550);
  }, [])



  return (
    <>
      <Navbar />
      <div className="main" id={`${renderFx}`}>
          
          <Features />
          <Demo />
      </div>
    </>
  )
}

export default App;