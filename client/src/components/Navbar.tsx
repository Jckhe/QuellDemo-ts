import logo from '../assets/quell-logo.png';
import { Dispatch, useEffect, useState, SetStateAction } from 'react';
import {Button, Stack, Divider, AppBar, Box, Fade, Slide, Typography, Hidden, Link} from '@mui/material';
import '../stylesheets/Navbar.css';
import quellBirdIcon from '../assets/images/quell_logos/QUELL-quail only.svg';
import CodeTwoToneIcon from '@mui/icons-material/CodeTwoTone';
import AspectRatioRoundedIcon from '@mui/icons-material/AspectRatioRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

interface Navbar {
  toggleRenderTeam: Dispatch<SetStateAction<boolean>>;
  teamComp: boolean;
}

export function Navbar({teamComp, toggleRenderTeam}: Navbar) {
  const [ rendered, setRendered ] = useState<boolean>(false);
  

  useEffect(() => {
    setRendered(true)
    
  }, [])


  const BirdLogo = () => {
    const [ birdEffect, toggleBirdEffect ] = useState<string>('');

    useEffect(() => {
      setTimeout(() => {
        toggleBirdEffect('quell-bird-pick')
        setTimeout(() => {
          toggleBirdEffect('')
        }, 800);
      }, 450);
    }, [])

    return (
      <Box>
        <img className="quell-bird-logo" id={birdEffect} src={quellBirdIcon} height="25px" width="30px"/>
      </Box>
    )
  }

  //BUTTON HELPER COMPONENTS 
  const AboutButton = () => {
    const [hover, setHover] = useState<boolean>(false);
    


    return (
      <Button
      onClick={() => {teamComp ? toggleRenderTeam(false) : null}}
      onMouseEnter={()=> setHover(true)}
      onMouseLeave={()=> setHover(false)}
      href="#scroll-about" sx={{ minWidth:"85px", minHeight: '40px', maxHeight:"40px", maxWidth:"90px", border: 1, overflow:'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }} color="secondary" variant='contained'>
        <Slide direction="down" timeout={{enter: 400, exit: 350}} in={!hover} mountOnEnter unmountOnExit><Typography sx={{ position: 'relative'}} variant='button'>About</Typography></Slide>
        <Slide direction="up"timeout={{enter: 400, exit: 100}} in={hover} mountOnEnter unmountOnExit><Groups2RoundedIcon /></Slide>
        </Button>
    )
  }


  
  const DemoButton = () => {
    const [hover, setHover] = useState<boolean>(false);
  

    return (
      <Button
      onClick={() => {teamComp ? toggleRenderTeam(false) : null}}
      onMouseEnter={()=> setHover(true)}
      onMouseLeave={()=> setHover(false)}
      href="#scroll-demo"      
      sx={{ minWidth:"85px", minHeight: '40px', maxHeight:"40px", maxWidth:"90px", border: 1, overflow:'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center'}} color="secondary" variant='contained'>
        <Slide direction="down" timeout={{enter: 400, exit: 350}} in={!hover} mountOnEnter unmountOnExit><Typography sx={{ position: 'relative'}} variant='button'>Demo</Typography></Slide>
        <Slide direction="up" timeout={{enter: 400, exit: 100}} in={hover} mountOnEnter unmountOnExit><AspectRatioRoundedIcon sx={{position: 'relative'}}/></Slide>
        </Button>
    )
  }

 

  const DocsButton = () => {
    const [hover, setHover] = useState<boolean>(false);
    



    return (
      <Link sx={{ textDecoration: 'none'}} target="_blank" href="https://github.com/open-source-labs/Quell#quell" rel="noreferrer">
      <Button
    
      onMouseEnter={()=> setHover(true)}
      onMouseLeave={()=> setHover(false)}    
      sx={{ minWidth:"85px", minHeight: '40px', maxHeight:"40px", maxWidth:"90px", border: 1, overflow:'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }} color="secondary" variant='contained'>
       
          <Slide direction="down" timeout={{enter: 200, exit: 250}} in={!hover} mountOnEnter unmountOnExit><Typography variant='button'>Docs</Typography></Slide>
          <Slide direction="up"timeout={{enter: 200, exit: 100}} in={hover} mountOnEnter unmountOnExit><MenuBookRoundedIcon /></Slide>
       
      </Button>
      </Link>
    )
  }




  return (
    <AppBar
    id={rendered ? 'renderedNav' : '' }
    sx={{opacity: 0, minHeight: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '15px', paddingRight: '15px'}} 
    color="primary" position="fixed" elevation={20} >
      {/* For Quell Bird Logo */}
      <BirdLogo />
      {/* Navmenu buttons */}
      <Stack sx={{overflow: 'hidden'}}direction="row" className="navMenuContainer" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <AboutButton />
        <DemoButton />
        <DocsButton />
      </Stack>
      <Button onClick={() => {toggleRenderTeam(!teamComp)}} sx={{ border: 1 }} variant='contained'>{teamComp ? "Home" : "Team" }</Button>
    </AppBar>
  )
}




// sx={{minHeight: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}
















// export function LogoAndNav() {
//   const [rendered, toggleRender] = useState<String>('unrenderedLogo')

//   //runs once on render, then procs the useState for rendered to change to renderedLogo
//   //these two strings are ID's in our CSS.
//   useEffect(() => {
//     setTimeout(() => {
//       toggleRender('renderedLogo')
//     }, 500);
//   }, [])




//   return (
//    <>
//     <div className="logoContainer">
//       <img src={logo} height="270px" width="500px" className="logo" id={`${rendered}`} alt="Quell" />
//     </div>
//     <NavBar />
//    </>
//   )
// }

// function NavBar()  {
//   const [stickyId, setStickyId] = useState<string>('');



//   useEffect(() => {
//     window.addEventListener('scroll', stickNavbar);
//     return () => window.removeEventListener('scroll', stickNavbar);
//   }, [])

//   const stickNavbar = () => {
//     if (window !== undefined) {
//       let windowHeight = window.scrollY;
//       // window height changed for the demo
//       windowHeight > 280 ? setStickyId('sticky-nav') : setStickyId('');
//     }
//   };

//   return (
//     <div id={`${stickyId}`} className="navbar">
//      <Stack direction="row" className="navMenuContainer" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
//        <Button href={"#demoContainer"} sx={{ border: 1 }} variant='contained'>Demo</Button>
//        <Button sx={{ border: 1 }} variant='contained'>Features</Button>
//        <Button sx={{ border: 1 }} variant='contained'>Team</Button>
//      </Stack>
//     </div>
//   )
// }







