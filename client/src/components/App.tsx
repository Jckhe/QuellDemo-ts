import '../stylesheets/App.css'
import { useState, useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { Demo } from './Demo';
import { About } from './About';
import Team from './TeamCards';
import { Footer } from './Footer';


function App() {
  const [ renderFx, toggleRenderFx ] = useState<string>('')
  const [ teamComp, toggleRenderTeam] = useState<boolean>(false)

  //runs once on render, then procs the useState for rendered to change to renderedLogo
  //these two strings are ID's in our CSS.
  useEffect(() => {
    toggleRenderFx('rendered')
  }, [])



  return (
    <>
      <Navbar teamComp={teamComp} toggleRenderTeam={toggleRenderTeam} />
      {/* conditionally renders between the team page and the main page. */}
        {teamComp && <Team />}
        <div className="main" id={renderFx}>
        {!teamComp && <About />}
        {!teamComp && <Demo />}
      </div>
      <Footer />
    </>
  )
}



export default App;