//import {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import  Typography  from '@mui/material/Typography';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

import LikeIcon from './LikeIcon'
import UserIcon from './UserIcon'


export const ArticleList=(props)=> {

  return (
    <>
    {props.articleList.map(article => {
      if (article.title.indexOf(props.searchKeyWord)>-1 || props.searchKeyWord===null) {
      return (
        <Grid key={`ranking-${article.uuid }`}>
          
          <Card 
            key={`ranking-item-${article.uuid }`}
            sx ={{ 
              m: 'auto',
              maxWidth:'800px',
              display: 'flex',
              mt: 5
            }}
            src={`detail/${article.uuid}`}>  

              <img
              width="50%"
              height="300px"
              src={article.image ? process.env.REACT_APP_API+article.image: 'http://design-ec.com/d/e_others_50/l_e_others_500.png'} 
              />

            <CardContent sx={{ width:'50%' }}>
              <Grid container align='right'>
                <UserIcon username={article.article_owner}></UserIcon>
              </Grid>

              <Box sx={{height:170}}>
                <Typography gutterBottom variant="h5" component="div">
                {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {article.abstract}
                </Typography>
              </Box>

              <Button size="small"><Link to={`/detail/${article.uuid}`}>詳細を見る</Link></Button>

              <Typography variant="body2" color="text.secondary" align='right' sx={{mr:2}}>
                <LikeIcon article={article} reload={props.reload} setReLoad={props.setReLoad}/>
              </Typography>
            
            </CardContent>

          </Card>
        </Grid>
        )}})}
  </>
  )
}


export default ArticleList;