import logo from '../assets/quell-logo.png';
import { useEffect, useState } from 'react';
import {Button, Stack, Divider} from '@mui/material';

export function LogoAndNav() {
  const [rendered, toggleRender] = useState<String>('unrenderedLogo')

  //runs once on render, then procs the useState for rendered to change to renderedLogo
  //these two strings are ID's in our CSS.
  useEffect(() => {
    setTimeout(() => {
      toggleRender('renderedLogo')
    }, 500);
  }, [])




  return (
   <>
    <div className="logoContainer">
      <img src={logo} height="270px" width="500px" className="logo" id={`${rendered}`} alt="Quell" />
    </div>
    <NavBar />
   </>
  )
}

function NavBar()  {
  const [stickyId, setStickyId] = useState<string>('');



  useEffect(() => {
    window.addEventListener('scroll', stickNavbar);
    return () => window.removeEventListener('scroll', stickNavbar);
  }, [])

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      // window height changed for the demo
      windowHeight > 280 ? setStickyId('sticky-nav') : setStickyId('');
    }
  };

  return (
    <div id={`${stickyId}`} className="navbar">
     <Stack direction="row" className="navMenuContainer" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
       <Button sx={{ border: 1 }} variant='contained'>Demo</Button>
       <Button sx={{ border: 1 }} variant='contained'>Features</Button>
       <Button sx={{ border: 1 }} variant='contained'>Team</Button>
     </Stack>
    </div>
  )
}







