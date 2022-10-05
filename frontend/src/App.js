import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home'
import Detail from './pages/Detail/Detail'
import MyPost from './pages/Mypost/Mypost'
import Create from './pages/Create/Create'
import DetailEdit from './pages/DetailEdit/DetailEdit'
import AllUserPost from './pages/AllUserPost/AllUserPost'
import Login from './pages/Login/Login'
import Signin from './pages/Signin/Signin'
import Setting from './pages/Setting/Setting';
import {Nomatch} from './pages/Nomatch.js'

import LoginRequired from './_components/LoginRequired';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/login' element={
              <Login />
            } />
            <Route path='/signin' element={
              <Signin />
            } />
            <Route path='/' element={
              <LoginRequired>
                <Home />
              </LoginRequired>
            }/>
            <Route path='/mypost' element={
              <LoginRequired>
                <MyPost/>
              </LoginRequired>
            }/>
            <Route path='/detail/:uuId/' element={
              <LoginRequired>
                <Detail/>
              </LoginRequired>
            }/>
            <Route path='/detail/:uuId/edit' element={
              <LoginRequired>
                <DetailEdit/>
              </LoginRequired>
            }/>
            <Route path='/create' element={
              <LoginRequired>
                <Create/>
              </LoginRequired>
            }/>
            <Route path='/all-user-post' element={
              <LoginRequired>
                <AllUserPost />
              </LoginRequired>
            }/>
            <Route path='/setting' element={
              <LoginRequired>
                <Setting />
              </LoginRequired>
            }/>
            <Route path="*" element={<Nomatch />} />
        </Routes>

    </div>
  );
}

export default App;
