
import {useState,useEffect} from 'react';
import axios from 'axios';
import  Typography  from '@mui/material/Typography';
import { Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

import { withCookies } from 'react-cookie';
import Template from '../../templates/Template';

const Setting =(props)=>{

  const [profImage,setProfImage] = useState(null)
  const [userName, setUserName]=useState(null)
  const [userId,setUserId]=useState(null)

  const token='JWT '+props.cookies.get('token')

  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/user/',
      {headers: {
        'Authorization': token
      }}
    )
      .then((response) => {
        setUserName(response.data.username)
        setProfImage(response.data.profile_image)
        setUserId(response.data.id)
      })
      .catch(error => console.log(error))
    }, [])


  const patchData = () => {
    let data={
      'profile_image':profImage
    }
    axios.patch(process.env.REACT_APP_API+`/user/${userId}/`, data,{
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': token
      }}
      )
        .then(
          window.location.href = "/setting"
        )
        .catch(error => {
          console.log(error);
        });
    }


  return(
    <Template title='アカウント設定'>
        <Grid>
          <Button 
          variant="text" 
          sx={{
              }}><Link to='/mypost'>一覧に戻る</Link>
          </Button>


            <Paper
              sx={{
                p: 2,
                maxWidth: '800px',
                m: 'auto',
                p: 5,
              }}
            >
              <Typography display='flex' align='left' variant="p" component="div" sx={{my:2}}>
                {}
              </Typography>
              <Grid container sx={{m:'auto',maxWidth:'800px'}}>
                <Grid item xs={12} md={6} lg={6} sx={{p:1}}>
                  <Typography fontSize={30} sx={{ textDecoration: 'underline' }}>
                    {userName}
                  </Typography>
                  <p>ユーザー情報...</p>
                </Grid>

                <Grid item xs={12} md={6} lg={6} sx={{p:1}}> 
                    <div>
                      現在のプロフィール画像<br/>
                      <img height="200" width="200" src={profImage ? 'http://localhost:8000/'+profImage : './default_user.png'} />
                    </div>
                    <Typography>
                      <Grid sx={{ml:3,mt:3}}>
                        →別の画像に変更する<br/>
                      <input type="file" 
                        accept=".png, .jpg, .jpeg"
                        onChange={(event) => setProfImage(event.target.files[0])}/>
                      </Grid>
                    </Typography>
                </Grid>
              </Grid>

              <Button align='left' variant="contained" component="span" onClick={patchData}>
                Update
              </Button>

            </Paper>
        </Grid>
    </Template>
    )
};

export default withCookies(Setting)