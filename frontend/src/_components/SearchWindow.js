import {useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography  from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const SearchWindow=(props)=> {

  const [expanded, setExpanded] =useState(false);

  const handleChange = ()=>{
    setExpanded(!expanded)
  }

  return (
      <Grid sx ={{ 
        m: 'auto',
        maxWidth:'800px',
        mt: 2
      }}>

      <Grid>
        
        <Paper elevation={2} >
        { expanded ?
        <>
        <Button disableRipple={true} color="inherit" variant="contained" fullWidth={true} onClick={handleChange} startIcon={<ExpandLessIcon />}>条件検索</Button>
        <Typography variant="p" sx={{display:'flex',verticalAlign: 'middle'}}>
          <TextField
              id="search"
              label="キーワード検索"
              defaultValue={props.searchKeyWord}
              sx ={{
                width:400,
                m:2
              }}
              onChange={(event) => {
                props.setSearchKeyWord(event.target.value)
              }}/><Typography sx={{my:'auto',ml:1}}>を（タイトル or 要旨）で含む</Typography >
        </Typography>
        </>
        :
        <Button disableElevation={true} color="inherit" variant="contained" fullWidth={true} onClick={handleChange} startIcon={<ExpandMoreIcon/>}>条件検索</Button>
        }
        </Paper>
      </Grid>
    </Grid>
  );
}


export default SearchWindow;