import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './appRoutes.jsx'
import { AuthProvider } from './features/auth/AuthContext.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'

const App = () => {
  return (
    <AuthProvider>                              {/* Ab ye karne se kya hua ki hamare poore app ke pass wo user setuser loading setloading ka saara dataa chala gya*/ }
      <InterviewProvider>                        {/*ab yaha humne apne interviewProvider ko poore app me wrap kr diya hai*/}
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
