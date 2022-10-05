import {useState,useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import  Typography  from '@mui/material/Typography';
import { Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';

import Template from '../../templates/Template';
import MyCalendar from './_components/MyCalendar.js'
import MyChart from './_components/MyChart.js'


const MyPost=(props)=>{

  const [articleList, setArticle] = useState([]);
  const [articleCreatedDate,setArticleCreatedDate]= useState([]);
  const [numOfArticleThisMonth,setNumOfArticleThisMonth]=useState(0);
  const [numOfArticleToRead,setNumOfArticleToRead]=useState(0);

  //分析内容を取得
  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/analysis/',
      {headers: {
        'Authorization': token
      }}
    )
      .then((response) => {
        setArticleCreatedDate(response.data.articles_created_dates)
        setNumOfArticleThisMonth(response.data.number_of_articles_in_this_month)
        setNumOfArticleToRead(response.data.number_of_articles_to_read)
      })
      .catch(error => console.log(error))
    }, [])

  //記事内容を取得
  const token='JWT '+props.cookies.get('token')
  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/my-articles/',
      {headers: {
        'Authorization': token
      }}
    )
      .then((response) => setArticle(response.data))
      .catch(error => console.log(error))
    }, [])

  return(
    <Template title='Home'>

    <Typography variant="h6" component="div" sx={{mt:3}}>
      分析
    </Typography>

    <Grid container sx={{m:'auto',maxWidth:'800px'}}>

      <Grid item xs={12} md={7} lg={7} sx={{p:1}}> 
        <MyCalendar checkedDate={articleCreatedDate}/>
      </Grid>
      <Grid item xs={12} md={5} lg={5} sx={{p:1}}>
        <MyChart numOfArticleToRead={numOfArticleToRead} numOfArticleThisMonth={numOfArticleThisMonth}/>
      </Grid>
    </Grid>

      <Typography variant="h6" component="div" sx={{mt:3}}>
      最近の投稿
      </Typography>

        {
          articleList.map(article => {
            return (

              <Grid key={`ranking-${article.uuid }`}>
                <Card 
                  key={`ranking-item-${article.uuid }`}
                  sx ={{ 
                    m: 'auto',
                    maxWidth:'800px',
                    display: 'flex',
                    mb: 3,
                    p:1
                  }}
                  src={`detail/${article.uuid}`}
                >    
                  <img 
                  width="50%"
                  height="300px"
                  src={article.image ? 'http://localhost:8000'+article.image: 'http://design-ec.com/d/e_others_50/l_e_others_500.png'} 
                  />

                  <CardContent sx={{ width:'50%' }}>

                    <Grid container align='right'>
                      <Box sx={{border: '1px solid grey', borderRadius:2,px:0.7,fontSize: 19}}>
                        <AccountCircleIcon sx={{verticalAlign: 'middle'}}/>{article.article_owner}
                      </Box>
                    </Grid>


                    <Typography gutterBottom variant="h5" component="div">
                    {article.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                    {article.abstract}
                    </Typography>

                    <Button size="small"><Link to={`/detail/${article.uuid}`}>詳細を見る</Link></Button>

                  </CardContent>
                </Card>
              </Grid>

            )
          })
          
        }
      </Template>
   )
}


export default withCookies(MyPost);