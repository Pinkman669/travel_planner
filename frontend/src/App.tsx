import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import Home from './features/home/Home';
import { AuthGuard } from './features/auth/AuthGuard';
import { FacebookCallback } from './features/auth/FacebookCallback';
import MapPage from './api/Map';
import { ToastContainer } from 'react-toastify';
import TripEvent from './features/event/TripEvent';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/facebook-callback' element={<FacebookCallback />}></Route>
        <Route path='/map' element={<MapPage />}></Route>
        <Route element={<AuthGuard />}>
          <Route path='/' element={<Home />}></Route>
          <Route path='/trip-event' element={<TripEvent />}></Route>
          <Route path='*' element={<Home />}></Route>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div >
  );
}

export default App;
