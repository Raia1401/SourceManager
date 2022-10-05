
import {useState,useEffect} from 'react';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import  Typography  from '@mui/material/Typography';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import Template from '../../templates/Template';

//MarkDOWN
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';



function ShowAlerts(props) {
  if (props.alert){
    return <Alert severity="error">{props.alert}</Alert>
  } else {
    return <></>
  }
}


const DetailEdit=(props)=>{

  const { uuId } = useParams();

  //論文の基礎情報
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  //論文内容のメモ
  const [abstract, setAbstract] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [image,setImage] = useState('');

  //公開設定
  const [isOpen, setIsOpen] = useState('false');

  //loading中か確認
  const [loadFlag, setLoadFlag] = useState(false);

  //validationアラート
  const [urlAlert,setUrlAlert]= useState(null)
  const [titleAlert,setTitleAlert]= useState(null)

  const token='JWT '+props.cookies.get('token')

  //現時点のデータを全て取ってくる
  useState(() => {
    axios.get(process.env.REACT_APP_API+`/my-articles/${uuId}/`,
    {headers: {
      'Authorization': token
    }}
    )
      .then((response) => {

        //論文基礎情報
        setTitle(response.data[0].title)
        setCategory(response.data[0].category)
        setAuthor(response.data[0].author)

        //論文内容のメモ
        setAbstract(response.data[0].author)
        setBody(response.data[0].body)
        setUrl(response.data[0].url)
        setImage(response.data[0].image)

        //投稿を公開するか
        setIsOpen(response.data[0].is_open)

      })
      .catch((error) => {
        console.log(error)
      })
    }, [])


  //Loadingが終わったか確認する
  useEffect(() => {
    if (abstract.length != 0) {
        setLoadFlag(true)
      } else {
        setLoadFlag(false)
      }
    }, [isOpen])
  

  //ボタンが押されたら投稿をアップデートする
  const updateData = () => {

    let data={
      'title':title,
      'category':category,
      'author':author,
      'abstract':abstract,
      'body':body,
      'url':url,
      'is_open':isOpen,
    }
    if (image){
      data['image']=image
    }

    axios.patch(process.env.REACT_APP_API+`/my-articles/${uuId}/`, data,{
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': token
      }
    })
      .then(response =>{
        window.location.href = "/Mypost"
        })
      .catch(error => {

        const url_error = error.response.data.url
        const title_error = error.response.data.title
        
        if (url_error != null) {
          setUrlAlert(url_error)
        } else {
          setUrlAlert(null)
        }
        
        if (title_error != null){
          setTitleAlert(title_error)
        } else {
          setTitleAlert(null)
        }

      });
  }


  return(
    <Template title='編集'>
        <Grid>
          <Button variant="text" ><Link to='/mypost'>一覧に戻る</Link>
          </Button>

          {loadFlag ?
            <Paper
              sx={{
                p: 2,
                maxWidth: '800px',
                m: 'auto',
                p: 5,
              }}
            >
              
                <ShowAlerts alert={titleAlert}/>

                <Typography align='left' gutterBottom variant="h5" component="div" sx={{mt: 1}}>
                <TextField
                      defaultValue={title}
                      fullWidth
                      required
                      label="タイトル"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                </Typography>

                <Typography align='left' gutterBottom variant="h5" component="div" sx={{mt: 1}}>
                <TextField
                      defaultValue={author}
                      fullWidth
                      required
                      label="論文著者"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                </Typography>

                <Typography align='left' variant="p" component="div">
                  <TextField
                    defaultValue={category}
                    label="カテゴリー"
                    onChange={(event) => setCategory(event.target.value)}
                  />
                </Typography>

                <Divider sx={{my:2}}/>

                <Typography align='left' variant="p" component="div">
                    どんな研究？：<br/>
                    <TextField
                      defaultValue={abstract}
                      multiline
                      rows={5}
                      fullWidth
                      onChange={(event) => setAbstract(event.target.value)}
                    />
                </Typography>

                <Divider sx={{my:2}}/>

                <Typography align='left' variant="p" component="div">
                    メモ：<br/>
                    <SimpleMDE onChange={(e) => setBody(e)} value={body}/>
                </Typography>

                <Divider sx={{my:2}} />

                <ShowAlerts alert={urlAlert}/>
                <Typography align='left' variant="p" component="div">
                    <TextField
                      defaultValue={url}
                      fullWidth
                      label="文献場所(URL)"
                      onChange={(event) => setUrl(event.target.value)}
                    />
                </Typography>

                <Typography display='flex' align='left' variant="p" component="div" sx={{my:2}}>
                <Box sx={{border: '1px solid grey', borderRadius:2,px:0.7}}>
                  <div>
                  現在の画像：<br/>
                  <img height="200" src={image ? 'http://localhost:8000'+image: 'http://design-ec.com/d/e_others_50/l_e_others_500.png'} />
                  </div>
                
                </Box>
                <Grid sx={{ml:3,mt:3}}>
                  →別の画像に変更する<br/>
                　<input type="file" 
                  accept=".png, .jpg, .jpeg"
                  onChange={(event) => setImage(event.target.files[0])}/>
                </Grid>
                </Typography>
                
                
                <Typography align='left' variant="p" component="div">

                <Checkbox checked={isOpen} label="公開する" onChange={(event) => setIsOpen(event.target.checked)}/>
                公開する
                </Typography>

                <Button align='left' variant="contained" component="span" onClick={updateData}>
                  更新する
                </Button>
            </Paper>
            :
            <div>now loading...</div>
            }
            

        </Grid> 
        
      </Template> 
    )
}

export default withCookies(DetailEdit)