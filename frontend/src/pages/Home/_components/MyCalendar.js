import {useState} from 'react';
import Calendar from 'react-calendar';
import './Calendar.css'

import Paper from '@mui/material/Paper';
import  Typography  from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export const MyCalendar=(props)=> {

  //カレンダー
  const [calendarValue, setCalendarValue] = useState(new Date());
  const checkedDate=props.checkedDate

  //カレンダー表示処理
  //20190501などの形式にする
  const getFormatDate=(date)=> {
    return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}`;
  }
  
  const getTileContent = (props) => {
    if (props.view !== "month") {
      return null;
    } 
    var its_date = getFormatDate(props.date)
    if (checkedDate.includes(its_date)){
      return ('✔️');
    }
    return null
  };

  return (
    <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 370,
          }}
        >
          <Typography variant="p" sx={{mt:2}}>
            論文を読んだ日
          </Typography>
          <Grid sx={{mx:'auto'}}>
              <Calendar onChange={setCalendarValue} value={calendarValue} tileContent={getTileContent}/>
          </Grid>
    </Paper>
  );
}


export default MyCalendar;