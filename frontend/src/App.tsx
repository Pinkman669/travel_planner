import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import Home from './features/home/Home';
import { AuthGuard } from './features/auth/AuthGuard';
import MapTest from './api/map';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/map' element={<MapTest />}></Route>
        <Route element={<AuthGuard />}>
          <Route path='/' element={<Home />}></Route>
          <Route path='*' element={<Home />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
