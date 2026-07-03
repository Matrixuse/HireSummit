import React, { useState } from 'react'

import { useNavigate , Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const Login = () => {
    const { handleLogin, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    if (loading) {
      return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-900 text-white'>
          <h1 className='font-bold text-2xl'>Loading...</h1>
        </div>
      )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({ email, password })
        navigate('/')
    }
  return (
    <main>
      <div className='min-h-screen w-full flex items-center justify-center bg-gray-900'>
        {/* Card Container */}
        <div className='flex flex-col gap-4 text-white'>
            <h1 className='font-bold text-2xl text-white'>Login</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                    <label htmlFor='username'>Enter Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} 
                     className='border rounded-lg' type='email' id='email' name='email' placeholder='Enter your email' required />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='password'>Enter Password</label>
                    <input onChange={(e) => setPassword(e.target.value)}
                     className='border rounded-lg px-3 py-2 text-black' type='password' id='password' name='password' placeholder='Enter your password' required />
                </div>
                <button className='flex flex-col bg-pink-500 hover:bg-pink-600 rounded-lg p-4' type='submit'>Login</button>
            </form>
            <p>Don't have an account? <Link className='text-pink-500 hover:text-pink-600' to='/register'>Register</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Login
