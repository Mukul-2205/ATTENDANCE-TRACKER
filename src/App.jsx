import { Outlet } from "react-router-dom"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import authService from "./appwrite/auth"
import {login as authSliceLogin, logout as authSliceLogout} from './store/authSlice'
function App() {

  const dispatch=useDispatch()
  useEffect(()=>{
        const loadUser=async ()=>{
            try {
              const userData=await authService.getCurrentUser()
              if(userData)dispatch(authSliceLogin(userData))
              else dispatch(authSliceLogout())
            } catch (error) {
              console.log("Error in App: ",error);
              
            }

        }

        loadUser()
  },[dispatch])
  

  return (
    <>
      <Outlet/>
    </>
  )
}

export default App
