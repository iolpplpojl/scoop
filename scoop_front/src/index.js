import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Main from './Main';
import { Connector } from './Connector';
import "react-router-dom";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { ChatPage } from './component/ChatPage';
import { Login } from './login';
import SignUp from './SignUp';
import Home from './home';
import { FindPw } from './find-pw';
import { ResetPassword } from './ResetPassword';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Connector>
  <Routes>
    <Route path="/home" element={<Home />}></Route>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/register" element={<SignUp></SignUp>}></Route>
    <Route path="/find-password" element={<FindPw></FindPw>}></Route>
    <Route path='/reset-password' element={<ResetPassword></ResetPassword>}></Route>
    <Route path="/" element={<Main />}>
    <Route path="/channel/" ></Route>
    <Route path="/channel/"></Route>
    <Route path="/channel/:server"></Route>
    <Route path="/channel/:server/:id" element={
        <ChatPage></ChatPage>
    }>  
    </Route>
    </Route>
  </Routes>
  </Connector>
  </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
