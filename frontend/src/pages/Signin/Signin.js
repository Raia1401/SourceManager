import {useState} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import  Typography  from '@mui/material/Typography';
import { Button} from '@mui/material';
import Box from '@mui/material/Box';

export default function Signin(){

  const [username, setUsername] = useState([]);
  const [password1, setPassword1] = useState([]);
  const [password2, setPassword2] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
  const [message,setMessage]=useState('')
  
  const createuserUrl=process.env.REACT_APP_API+'/user/'
  const jwtUrl=process.env.REACT_APP_API+'/api/token/'

  function checkPassword(password1,password2){
    if (password1 === password2){
      return true
    } else {
      setMessage("パスワードが異なります")
      return false
    }
  }

  const doSignin=(event) => {
    event.preventDefault();

    if (checkPassword(password1,password2)){

      const data={
        'username':username,
        'password':password1,
      }

      axios.post(createuserUrl,data,{
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          axios.post(jwtUrl,data,{
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
              //console.log(error.response.data)
            })
          })
        .catch((error) => {
          let error_message_user=error.response.data.message.username
          let error_message_password=error.response.data.message.password
          console.log(error_message_user)
          if (error_message_password){
            setMessage(error_message_password)
          } else if (error_message_user) {
            setMessage(error_message_user)
          } else {
            setMessage(null)
          }
          console.log(error.response.data)
        })
      }
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
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                  新規登録画面
              </Typography>

              <TextField
                    fullWidth
                    required
                    label="ユーザーネーム"
                    onChange={(event) => setUsername(event.target.value)}
                    sx={{ m:1 }}
                  />
              
              <TextField
                fullWidth
                id="outlined-password-input"
                label="パスワード"
                type="password"
                autoComplete="current-password"
                onChange={(event) => setPassword1(event.target.value)}
                sx={{ m:1 }}
              />

              <TextField
                fullWidth
                id="outlined-password-input"
                label="パスワード（確認）"
                type="password"
                autoComplete="current-password"
                onChange={(event) => setPassword2(event.target.value)}
                sx={{ m:1 }}
              />

              <Typography variant="p" component="div" color="error">
              {message}
              </Typography>
              
              <Button align='left' variant="contained" component="span" sx={{ m:1 }} onClick={doSignin}>
                ユーザー登録
              </Button>

              <Box>
                <Button>
                    <Link to={`/login`}>ログインはこちら</Link>
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          
            
        }
      </div>
   )

}
