import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister, loading } = useAuth();
    const[username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (loading) {
      return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-900 text-white'>
          <h1 className='font-bold text-2xl'>Loading...</h1>
        </div>
      )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({ username, email, password })
        navigate('/login')
    }
  return (
    <main className='min-h-100vh w-100% flex items-center justify-center'>
      <div className='min-h-screen w-full flex items-center justify-center bg-gray-900'>
        {/* Card Container */}
        <div className='flex flex-col gap-4 text-white'>
            <h1 className='font-bold text-2xl text-white'>Register</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                    <label htmlFor='username'>Enter Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} className='border rounded-lg' type='text' id='username' name='username' placeholder='Enter your username' required />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='email'>Enter Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} className='border rounded-lg' type='email' id='email' name='email' placeholder='Enter your email' required />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='password'>Enter Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className='border rounded-lg' type='password' id='password' name='password' placeholder='Enter your password' required />
                </div>
                <div className='flex flex-col bg-pink-500 hover:bg-pink-600 rounded-lg p-4'>
                    <button type='submit'>Register</button>
                </div>
            </form>
            <p>Already have an account? <Link className='text-pink-500 hover:text-pink-600' to='/login'>Login</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Register
