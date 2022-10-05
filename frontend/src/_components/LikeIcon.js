import { withCookies } from 'react-cookie';
import axios from 'axios';
import {useState} from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';

export const LikeIcon=(props)=> {

  const article=props.article
  const token='JWT '+props.cookies.get('token')
  const setReLoad=props.setReLoad
  const reload=props.reload

  const handleClickLikes = (article) => {
    let like_data = article.likes_data_of_requestuser[0]

    if (like_data) {
      let data = {
        'headers':{
          'Authorization': token
        },
      }

      axios.delete(`${process.env.REACT_APP_API}/likes/${like_data.id}/`, data)
        .then(()=> {
          setReLoad(reload?false:true)
          //window.location.reload()
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      let data={
        'uuid':article.uuid,
      }
      axios.post(process.env.REACT_APP_API+'/likes/', data,{
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': token
        }
      })
        .then((response)=> {
          setReLoad(reload?false:true)
        })
        .catch(error => {
          console.log(error);
        })
    }
    };

    const Is_requestuser_like = ({ article }) => {
      const result = (article.likes_data_of_requestuser.length) ? true : false
      return result
    }

  return (
    <IconButton onClick={() => handleClickLikes(article)}>
      { Is_requestuser_like({article}) 
        ?<FavoriteIcon sx={{ color:pink[500], verticalAlign: 'middle'}} />
        :<FavoriteBorderIcon sx={{verticalAlign:'middle'}}/>
      }
      {article.likes_count}
    </IconButton>
  );
}



export default withCookies(LikeIcon);