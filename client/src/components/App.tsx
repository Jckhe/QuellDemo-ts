import '../stylesheets/App.css'
import React, { useState, useEffect } from 'react';
import {Button, Stack, Divider} from '@mui/material';
import { LogoAndNav } from './LogoHeading';
import { Demo } from './Demo';



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
    <div className="main" id={`${renderFx}`}>
        <LogoAndNav />
        <Demo />
    </div>
  )
}

export default App;