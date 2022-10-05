import axios from 'axios';
import { withCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';


const LoginRequired= (props) =>{

  const apiUrl=process.env.REACT_APP_API+'/api/token/verify/'

  if (props.cookies.get('token') != null) {

    const sending_data={
      'token':props.cookies.get('token')
    }

    axios.post(apiUrl,sending_data,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((props) => {
        })
      .catch((error) => {
        console.log(error.response.data)
        console.log('ログインしていないユーザーはアクセスできません')
        window.location.href = '/login'
      })

    return props.children

  } else {
    return <Navigate to='/login'/>
  }


}

export default withCookies(LoginRequired);
