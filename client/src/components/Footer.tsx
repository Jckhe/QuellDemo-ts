import logo from '../assets/quell-logo.png';
import { Dispatch, useEffect, useState, SetStateAction } from 'react';
import quellBirdIcon from '../assets/images/quell_logos/QUELL-quail only.svg';
import {AppBar} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '../assets/images/icons/medium-icon.png'
import '../stylesheets/Navbar.css';

export function Footer() {



  return (
    <div className="footerContainer">
      <div className="footer-image">
        <img height="25px" width="30px" className="quell-bird-logo" src={quellBirdIcon}/>
      </div>
      <div className="footer-text">
      <h1 style={{fontSize: '18px'}}>{'\u00A9'}2020 Quell | MIT License</h1>
      </div>
      <div className="footer-links">
        <a href="https://github.com/open-source-labs/Quell"><GitHubIcon sx={{color: 'black'}} /></a>
        <a href="medium-article-placeholder"><img className="medium-icon" src={MediumIcon}/></a>
      </div>
    </div>
  )
}