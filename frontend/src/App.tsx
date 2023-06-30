import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
      </Routes>
    </div>
  );
}

export default App;
