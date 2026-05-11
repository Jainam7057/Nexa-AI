import { Eye } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider.jsx';

function Login() {
  const [ formData, setFormData ]=useState({
      email:"",
      password:"",
  })
   const [ error, setError ]=useState("")
   const [ loading, setLoading ]=useState(false)

   const navigate=useNavigate()

   const [,setAuthUser]=useAuth()
   
   const handleChange=(e)=>{
    const name= e.target.name;
    const value= e.target.value;

    setFormData({
      ...formData,
      [name]:value,
    })
   }

   const handleLogin= async ()=>{
    setLoading(true)
    setError("")
       try {
         const {data} = await axios.post("http://localhost:3000/api/login",{
          email:formData.email,
          password:formData.password,
        },{
          withCredentials:true
        })
        console.log(data)
         alert(data.message || "Login Succeeded")
         localStorage.setItem("user",JSON.stringify(data.isUser))
         localStorage.setItem("token",data.token)
         setAuthUser(data.token)
   navigate('/')

} catch (error) {

   const msg =
      error?.response?.data?.message ||
      "Login Failed!";

   setError(msg)

   console.log(error)

} finally {
   setLoading(false)
}
   }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <div className='bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg'>
        <h1 className='text-white items-center justify-center text-center'>Login</h1>
      
      
      <div  className='mb-4 mt-2'>
        <input className='w-full border border-gray-600 bg-transparent rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="email" name='email'  value={formData.email} onChange={handleChange} placeholder='Email'/>
      </div>
      <div  className='mb-4 mt-2 relative'>
        <input className='w-full border border-gray-600 bg-transparent rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="password" name='password'  value={formData.password} onChange={handleChange} placeholder='Password' />
        <span className='right-3 top-3 text-gray-500 absolute'><Eye size={18}/></span>
      </div>

      {error &&  <span className='text-red-600 text-sm mb-4'>{error}</span>}

      <p className='text-xs text-gray-400 mt-4 mb-6'> By signing up or logging in, you consent to Nexa AI's{" "}
          <a className="underline" href="">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className=" underline" href="">
            Privacy Policy
          </a>{" "}
          .</p>

          <button onClick={handleLogin} disabled={loading} className='w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50'>{loading? "Logging in...":"Login"}</button>

          <div className='flex justify-between mt-4 text-sm'>
            <a className='text-[#7a6ff6] hover:underline' href="">Haven't account? </a>
            <Link  className='text-[#7a6ff6] hover:underline' to='/Singup'>Singup</Link>
          </div>


     </div>
    </div>
  )
}

export default Login;

 
