import {Box, Divider} from '@mui/material'



export function Demo() {
  return (
    <>
      <div className="demoContainer">
        <LeftSide />
        <Divider  orientation="vertical" />
        <RightSide />
      </div>
    </>
  )
}

function LeftSide() {
  return (
    <div className="demoLeft"> 
      <h2>Left</h2>
    </div>
  )
}

function RightSide() {
  return (
    <div className="demoRight"> 
      <h2>Right</h2>
    </div>
  )
}