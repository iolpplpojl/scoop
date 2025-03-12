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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Connector>
  <Routes>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/register" element={<SignUp/>} />
    <Route path="/" element={<Main />}>
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
