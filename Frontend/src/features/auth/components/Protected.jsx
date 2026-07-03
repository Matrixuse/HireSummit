import { useAuth } from '../hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';
import React from 'react'

const Protected = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className='min-h-screen w-full flex items-center justify-center bg-gray-900 text-white'>
                <h1 className='font-bold text-2xl'>Loading...</h1>
            </div>
        )
    }

    if(!user) {
        return <Navigate to="/login" replace />;
    }

  return (
      children
  )
}

export default Protected
