import { withCookies } from 'react-cookie';
import axios from 'axios';
import {useState,useEffect} from 'react';

import Box from '@mui/material/Box';

export const UserIcon=(props)=> {

  const [profImage,setProfImage] = useState(null)
  const [userName, setUserName]=useState(null)
  const [userId,setUserId]=useState(null)

  const token='JWT '+props.cookies.get('token')

  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/user/',
      {headers: {
        'Authorization': token
      },
      params: {
        'username': props.username
      }}
    )
      .then((response) => {
        setUserName(response.data.username)
        setProfImage(response.data.profile_image)
        setUserId(response.data.id)
      })
      .catch(error => console.log(error))
    }, [])
  
  const image_style={
    borderRadius: '50%',
    width:'30px',
    height:'30px',
    verticalAlign: 'middle',
    margin:'2px'
  }

  return (
    <Box>
      <div>
        <img style={image_style} src={profImage ? process.env.REACT_APP_API+'/'+profImage : './default_user.png'} />
        {userName}
      </div>
    </Box>
  );
}



export default withCookies(UserIcon);