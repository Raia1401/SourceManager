
import {useState} from 'react';
import axios from 'axios';
import  Typography  from '@mui/material/Typography';
import { Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import { withCookies } from 'react-cookie';
import BasicModal from './_components/BasicModal';
import Template from '../../templates/Template';

//MarkDOWN
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';


function ShowAlerts(props) {
  if (props.category==='success') {
    return(
      <BasicModal message={'内容を保存・投稿しました。'}/>
    ) 
  } else if (props.category==='notfilled') {
    return(
      <BasicModal message={'エラー: 必要項目を埋めてください。'}/>
    )
  } else if (props.category==='error') {
    return(
      <BasicModal message={'エラー: 保存できませんでした。'}/>
    )
  }else {
    return null
  }
}



const Create =(props)=>{

  //論文の基礎情報
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  //論文内容のメモ
  const [abstract, setAbstract] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [image,setImage] = useState('');

  //内容の公開設定
  const [isOpen, setIsOpen] = useState(false);

  //アラート
  const [alert,setAlert]= useState('')

  const token='JWT '+props.cookies.get('token')

  const postData = () => {
    if (title===''){
      setAlert('notfilled')
    } else {
      let data={
        'title':title,
        'author':author,
        'category':category,
        'abstract':abstract,
        'body':body,
        'url':url,
        'image':image,
        'isOpen':isOpen
      }
      axios.post(process.env.REACT_APP_API+'/my-articles/', data,{
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': token
        }
      })
        .then(
          setAlert('success'),
          window.location.href = "/Mypost"
        )
        .catch(error => {
          console.log(error);
          setAlert('error')
        });
    }
  }


  return(
    <Template title='新規作成'>
        <Grid>
          <Button variant="text" ><Link to='/mypost'>一覧に戻る</Link>
          </Button>
            <Paper
              sx={{
                p: 2,
                maxWidth: '800px',
                m: 'auto',
                p: 5,
              }}
            >
              <ShowAlerts category={alert}/>

              <Typography align='left' gutterBottom component="div" sx={{mt: 1}}>
                論文情報：
              <TextField
                    fullWidth
                    required
                    label="タイトル"
                    onChange={(event) => setTitle(event.target.value)}
                  />
              </Typography>
              
              <Typography align='left' gutterBottom component="div" sx={{mt: 1}}>
              <TextField
                    fullWidth
                    required
                    label="著者"
                    onChange={(event) => setAuthor(event.target.value)}
                  />
              </Typography>
      

              <Typography align='left' variant="p" component="div">
                <TextField
                  label="カテゴリー"
                  onChange={(event) => setCategory(event.target.value)}
                />
              </Typography>


              <Divider sx={{my:2}}/>

              <Typography align='left' variant="p" component="div">
                  どんな研究？（140文字以内）：<br/>
                  <TextField
                    label="要約"
                    required
                    multiline
                    rows={5}
                    maxLength={140}
                    fullWidth
                    onChange={(event) => setAbstract(event.target.value)}
                  />
              </Typography>

              <Divider sx={{my:2}}/>

              <Typography align='left' variant="p" component="div">
                  その他メモ：<br/>
                  <SimpleMDE onChange={(e) => setBody(e)}/>
              </Typography>

              <Divider sx={{my:2}} />

              <Typography align='left' variant="p" component="div">
                  <TextField
                    fullWidth
                    label="文献場所(URL)"
                    onChange={(event) => setUrl(event.target.value)}
                  />
              </Typography>

              <Typography align='left' variant="p" component="div" sx={{my:2}}>
                画像をアップロードする：<br/>
              　<input type="file" 
              accept=".png, .jpg, .jpeg"
              onChange={(event) => setImage(event.target.files[0])}/>
              </Typography>
              
              <Typography align='left' variant="p" component="div" sx={{my:2}}>
              <Checkbox
                onChange={(event) => setIsOpen(event.target.checked)}
              />投稿を公開する
              </Typography>

              <Button align='left' variant="contained" component="span" onClick={postData}>
                Upload
              </Button>
              
            </Paper>

        </Grid> 
        
    </Template>
    )
}

export default withCookies(Create)