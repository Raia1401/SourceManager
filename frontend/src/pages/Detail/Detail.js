import {useState,useEffect} from 'react';
import axios from 'axios';
import { Link,useParams,useNavigate} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import ReactMarkdown from 'react-markdown'

import  Typography  from '@mui/material/Typography';
import { Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public';

import Template from '../../templates/Template';


const Detail=(props)=>{

  //論文内容
  const { uuId } = useParams();
  const [article, setArticle] = useState([]);
  const [body, setBody] = useState([]);

  //アクセス権限
  const [isUserOwnsArticle,setIsUserOwnsArticle]=useState(false);
  const token='JWT '+props.cookies.get('token')

  //ローディング中か
  const [loadFlag, setLoadFlag] = useState(false);

  //リンク設置用
  const navigate = useNavigate();


  //DBから記事データ取得
  useEffect(() => {
    axios.get(process.env.REACT_APP_API+`/my-articles/${uuId}/`,
    {headers: {
      'Authorization': token
    }}
    )
      .then((response) => {

        setArticle(response.data[0])
        setBody(response.data[0].body)

        const login_user=response.data[0].login_user
        const article_owner=response.data[0].article_owner
        if (login_user === article_owner){
          setIsUserOwnsArticle(true)
        }
      })
      .catch(error => console.log(error))
    }, [])
  

  //データの読み込みが終わったか確認
  useEffect(() => {
    if (body.length != 0) {
        setLoadFlag(true)
      } else {
        setLoadFlag(false)
      }
    }, [body])

    console.log(article.image)


  const deleteData=()=>{
    let result= window.confirm('投稿を削除します。よろしいですか？');
    if(result){
      axios.delete(process.env.REACT_APP_API+`/my-articles/${uuId}/`,
        {headers: {
          'Authorization': token
        }}
      )
      　.then((response) => {
          window.location.href = "/Mypost";
        })
        .catch(error => console.log(error))
   }
  }
  

  return(
    <Template title='詳細'>
        <Grid>
          
          <Button onClick={() => navigate(-1)}>
            一覧に戻る
          </Button>

            <Paper
              sx={{
                maxWidth: '800px',
                m: 'auto',
                p: 6,
              }}
              display='flex'
            >

              <Grid container direction="row-reverse">
                {article.is_open? 
                <Box sx={{border: '1px solid grey', borderRadius:2,px:0.7}}>
                    <PublicIcon sx={{verticalAlign: 'middle'}}/>公開中
                </Box>
                :
                <Box sx={{border: '1px solid grey', borderRadius:2,p:0.7}}>
                    <LockIcon sx={{verticalAlign: 'middle'}}/>非公開
                </Box>
              }
              </Grid>


              <img 
                height="300" 
                width="50%" 
                src={article.image ? 'http://localhost:8000'+article.image: 'http://design-ec.com/d/e_others_50/l_e_others_500.png'} 
              />
              
              <Box sx={{border: '1px solid grey', borderRadius:2,px:0.7}}>
              <Typography align='left' gutterBottom variant="h5" component="div">
                  {article.title}
              </Typography>
              
              <Typography align='left' variant="p" component="div">
                  論文著者：{article.author}
              </Typography>
              
              <Typography align='left' variant="p" component="div">
                  カテゴリー：{article.category}
              </Typography>

              <Typography align='left' variant="p" component="div">
                要約：{article.abstract}
              </Typography>

              </Box>

              <Divider sx={{mt:2}} />

              <Typography align='left' variant="p" component="div">
                  <br/>
                  {loadFlag ?
                    <ReactMarkdown children={body}/> 
                    :
                    <div>now loading...</div>
                  }
              </Typography>

              <Divider sx={{mt:5}}/>

              <Typography align='left' variant="p" component="div">
                  文献場所：<Link to={`${article.url}`}>{article.url}</Link>
              </Typography>
              
              { isUserOwnsArticle ?
              <Grid container direction="row-reverse">
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{mt:2,mr:1}} onClick={deleteData}>
                  削除する
                </Button>
                <Button variant="contained" sx={{mt:2,mr:1}} onClick={() => navigate(`/detail/${article.uuid}/edit`)} >
                  編集する
                  </Button>
              </Grid>
              :
              <></>}
              
            </Paper>
            
        </Grid> 
        
      </Template>
    )
}

export default withCookies(Detail);
