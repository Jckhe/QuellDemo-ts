import '../stylesheets/App.css'
import React, { useState, useEffect } from 'react';
import {Button, Stack, Divider, Fade, Alert} from '@mui/material';
import { Navbar } from './Navbar';
import { Demo } from './Demo';
import { About } from './About';
import { QueryStatus } from './Alert';
import Team from './TeamCards'


function App() {
  const [ renderFx, toggleRenderFx ] = useState<String>('unrendered')
  const [ teamComp, toggleRenderTeam] = useState<boolean>(false)

  //runs once on render, then procs the useState for rendered to change to renderedLogo
  //these two strings are ID's in our CSS.
  useEffect(() => {
    setTimeout(() => {
      toggleRenderFx('rendered')
    }, 550);
  }, [])



  return (
    <>
      <Navbar teamComp={teamComp} toggleRenderTeam={toggleRenderTeam} />
      {/* conditionally renders between the team page and the main page. */}
      {teamComp ? <Team/> : <div className="main" id={`${renderFx}`}>
          <About />
          <Demo/>
      </div>}
    </>
  )
}



export default App;