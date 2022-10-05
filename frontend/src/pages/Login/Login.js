import {useState,useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import  Typography  from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Container } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function Login(){

  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
  const [message,setMessage]=useState('')
  
  const apiUrl=process.env.REACT_APP_API+'/api/token/'

  // Danger ;

  const doLogin=(event) => {
    event.preventDefault();

    const data={
      'username':username,
      'password':password,
    }
    axios.post(apiUrl,data,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      setCookie('token',response.data.token)
      window.location.href = "/";
      })
    .catch((error) => {
      setMessage('*ログインできません')
      console.log(error.response.data)
    })
    }
  
  return(
     <div>
        {
          <Grid>

            <Paper
              sx={{
                p: 2,
                maxWidth: '350px',
                mx: 'auto',
                my: 10,
                p: 10,
                // height: 240,
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                  ログイン画面
              </Typography>

              <TextField
                    fullWidth
                    required
                    label="名前"
                    onChange={(event) => setUsername(event.target.value)}
                    sx={{ m:1 }}
                  />

              <TextField
                    fullWidth
                    required
                    label="パスワード"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    sx={{ m:1 }}
                  />

              <Typography variant="p" component="div" color="error">
              {message}
              </Typography>

              <Box>
                <Button variant="contained" component="span" sx={{ m:1 }} onClick={doLogin}>
                  ログイン
                </Button>
              </Box>
              
              <Box>
                <Button>
                    <Link to={`/signin`}>新規アカウント登録</Link>
                </Button>
              </Box>
              

            </Paper>


          </Grid>
          
          
            
        }
      </div>
   )

}
