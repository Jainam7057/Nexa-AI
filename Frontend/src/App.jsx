import React from 'react'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Singup from './components/Singup.jsx'
import { Navigate, Routes } from 'react-router';
import { Route } from 'react-router';
import { useAuth } from '../context/AuthProvider.jsx';


function App() {

  const [authUser]=useAuth();
  console.log(authUser)
  return (
    <div>
      <Routes>
        <Route path='/' element={authUser?<Home/>:<Navigate to={"/login"}/>}/>
        <Route path='/Login' element={authUser?<Navigate to={"/"}/>:<Login/>}/>
        <Route path='/Singup' element={authUser?<Navigate to={"/"}/>:<Singup/>}/>
      </Routes>


{/*       
      <Home/>
      <Login/>
      <Singup/> */}
    </div>
  )
}

export default App
