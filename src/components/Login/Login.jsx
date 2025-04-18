import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import {login as authSliceLogin} from '../../store/authSlice'
import Alert from '../Alert/Alert';


const Login = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [popupMessage, setPopupMessage] = useState(null)
    const authStatus=useSelector((state)=>state.auth.status)

    useEffect(()=>{
      if(popupMessage){
        const timer=setTimeout(()=>{
          setPopupMessage(null)
        },2000)
        return ()=>clearTimeout(timer)
      }
    },[popupMessage])
    const handleForm=async (e)=>{
        e.preventDefault()
        try {
            const session=await authService.login({email,password})
            if(session){
                const userData=await authService.getCurrentUser()
                if(userData)dispatch(authSliceLogin(userData))
                navigate('/dashboard')
            }
        } catch (error) {
            console.log("Error occured while logging in,",error);
            setPopupMessage({message: error.message, bgColor: "black"})
        }
    }
  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {popupMessage &&(
            <div className="absolute top-4 right-4 w-80 z-50">
              <Alert
                message={popupMessage.message}
                bgColor={popupMessage.bgColor}
                onClose={() => setPopupMessage(null)}
              />
            </div>
          )
        }
        <div className="bg-white rounded-xl shadow-2xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/50">
          {/* Decorative header strip */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to access your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleForm}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="yourname@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Sign in
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{'      '}
              <Link to="/signup" className='text-blue-600'>Sign up</Link>
            </div>
          </div>
        </div>

        {/* Footer */}
      </div>
    </section>
  );
};

export default Login;