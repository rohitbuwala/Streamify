import { Route, Routes } from 'react-router'
//import { useEffect, useState } from 'react'

import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from './pages/OnboardingPage.jsx'
import  {useQuery} from "@tanstack/react-query"
import {axiosInstance} from "./lib/axios.js"  


import { Toaster } from "react-hot-toast"

const App = () => {

  // tanstack query cresh course 
  //delete  => post put delete 
  // get =
  const {data , isLoading, error} = useQuery({queryKey: ["todos"],
    queryFn: async() => {

      const res = await axiosInstance.get("http://localhost:5001/api/auth/me")
   
      return res.data
    },
    retry: false
  });

console.log(data)
  // const [data , setdata] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null)

  // useEffect( () => {
  //   const getData = async () => {
  //     try {
  //       const data = await fetch("https://jsonplaceholder.typicode.com/todos")
  //       const json = await data.json()
  //     } catch (error) {
  //       setError(error)
  //     }finally{
  //       setIsLoading(false)
  //     }
  //   }
  // })
  return (
      <>
     <div className="p-5 text-center" data-theme="night">
  

   
      <Routes>
        <Route path='/'  element={<HomePage/>} />
        <Route path='/signup'  element={<SignUpPage/>} />
        <Route path='/login'  element={<LoginPage/>} />
        <Route path='/notfications'  element={<NotificationPage/>} />
        <Route path='/call'  element={<CallPage/>} />
        <Route path='/chat'  element={<ChatPage/>} />
        <Route path='/onboarding'  element={<OnboardingPage/>} />
      </Routes>

      <Toaster/>
</div>
    </>
  )
  
}

export default App