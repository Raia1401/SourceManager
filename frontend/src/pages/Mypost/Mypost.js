import {useState,useEffect,useContext} from 'react';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import Template from '../../templates/Template';
import SearchWindow from '../../_components/SearchWindow'
import ArticleList from  '../../_components/ArticleList'

const MyPost=(props)=>{

  //記事のリスト
  const [articleList, setArticle] = useState([]);
  //検索ワード
  const [searchKeyWord,setSearchKeyWord] = useState(null)
  //JWT認証
  const token='JWT '+props.cookies.get('token')
  const [reload,setReLoad]= useState(false)

  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/my-articles/',
      {headers: {
        'Authorization': token
      }}
    )
      .then(response => setArticle(response.data))
      .catch(error => console.log(error))
    }, [reload])

  
  return(
    <Template title='自分の記事'>
    <SearchWindow searchKeyWord={searchKeyWord} setSearchKeyWord={setSearchKeyWord} />
    <ArticleList articleList={articleList} searchKeyWord={searchKeyWord} reload={reload} setReLoad={setReLoad}/>
    </Template>  
   )
}


export default withCookies(MyPost);