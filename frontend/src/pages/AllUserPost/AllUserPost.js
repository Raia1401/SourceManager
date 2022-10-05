import {useState,useEffect} from 'react';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import Template from '../../templates/Template';
import SearchWindow from '../../_components/SearchWindow'
import ArticleList from  '../../_components/ArticleList'

const AllUserPost=(props)=>{

  const [articleList, setArticleList] = useState([]);
  const [searchKeyWord,setSearchKeyWord] = useState(null)
  const [reload,setReLoad]= useState(false)
  const token='JWT '+props.cookies.get('token')

  //全てのユーザーの記事を取ってくる
  useEffect(() => {
    axios.get(process.env.REACT_APP_API+'/all-user-articles/',
      {headers: {
        'Authorization': token
      }}
    )
      .then((response) => {
        setArticleList(response.data)
      })
      .catch(error => console.log(error))
    },[reload])
  
  return(
    <Template title='みんなの投稿'>
      <SearchWindow searchKeyWord={searchKeyWord} setSearchKeyWord={setSearchKeyWord} />
      <ArticleList articleList={articleList} searchKeyWord={searchKeyWord} reload={reload} setReLoad={setReLoad}/>
    </Template>
   )
}


export default withCookies(AllUserPost);