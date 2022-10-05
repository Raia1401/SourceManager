import {useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import NumberFormat from "react-number-format"
import axios from 'axios';
import { withCookies } from 'react-cookie';

import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { Button} from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export const MyChart=(props)=> {

  const [goal,setGoal] = useState(null);
  const token='JWT '+props.cookies.get('token')

  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartData = {
    labels: ['読んだ論文数','未達成'],
    datasets: [
      {
        data: [props.numOfArticleThisMonth,props.numOfArticleToRead-props.numOfArticleThisMonth],
        backgroundColor: ['#FFE5EC', '#DEDFE0'],
      },
    ],
  };


  //目標本数を設定
  const submitGoal=()=>{
    let result= window.confirm(`今月の目標を${goal}本で設定します。よろしいですか？`);
    if(result){
      let data={
        'number_of_articles_to_read':goal,
      }
      axios.post(process.env.REACT_APP_API+'/analysis/', data,{
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': token
        }
      })
        .then(
          window.location.reload()
        )
        .catch(error => {
          console.log(error);
        });
      }
    }

  return (
      <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 370,
          }}
        >
            <Typography variant="p">
              今月の目標数
            </Typography>
            { props.numOfArticleToRead ?
              <>
              <Doughnut data={chartData}/>
              <Typography variant="p">
                {props.numOfArticleThisMonth}/{props.numOfArticleToRead-props.numOfArticleThisMonth}
              </Typography>
              </>
              :
              <Typography variant="p">
                <Alert severity="info" sx={{my:3}}>今月の目標が設定されていません</Alert>
                  <FormControl>
                    <NumberFormat
                      defaultValue="0"
                      isAllowed={(values) =>{
                        const numValue = Number(values.value)
                        if (isNaN(numValue)) return true
                        return ( numValue >= 0 && numValue <= 500)
                      }}
                      onValueChange={(values, sourceInfo) => {
                        setGoal(values.value);
                      }}
                      customInput={TextField}
                      size="small"
                      label="今月の目標本数"
                      sx={{ width: "25ch" }}
                    />
                    <FormHelperText>設定してみよう！</FormHelperText>
                  </FormControl>
                <Button variant="contained" sx={{mt:3}} onClick={submitGoal}>目標を設定する</Button>
              </Typography>
            }
          </Paper>
      );
}


export default withCookies(MyChart);