import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { api } from '../utils/axios';
import { useUser } from '../utils/UserContext';

export const Auth = () => {
  let navigate = useNavigate()
  let { setUsername, setAccesstoken } = useUser()
  let [isPasswordHidden, setIsPasswordHidden] = useState(true)
  let [isLogin, setIsLogin] = useState(true)
  let [authData, setAuthData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = isLogin ? 'login' : 'signup'
    api.post(`auth/${url}`, authData)
      .then(({ data }) => {
        setAuthData({ name: '', email: '', password: '' })
        setUsername(data.name)
        setAccesstoken(data.accesstoken)
        localStorage.setItem('accesstoken', data.accesstoken)
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        console.log(err.response)
      })
  }

  const labelStyle = 'text-(--auth-text) mt-3 mb-1'
  const inputStyle = 'bg-[#222324] px-2 py-[0.4rem] rounded-lg outline-(--auth-primary) w-full'
  return (
    <div className='bg-[#95998e] min-h-screen flex justify-center items-center '>

      {/* auth box */}
      <div className='bg-[#0f0f0f] w-[80vw] min-h-[80vh] p-4 flex rounded-2xl gap-10 lg:w-[55vw]'>
        {/* designe part */}
        <div className='w-[50%] hidden sm:block relative'>
          <img className='w-full h-full rounded-2xl' src="https://cdn.pixabay.com/photo/2024/01/04/15/42/sailing-8487722_640.png" alt="" />
          <p className='absolute bottom-5 left-3'>
            Built for productivity and collaboration.
            Everything your team needs to stay organized.
          </p>
        </div>
        {/* content part */}
        <div className='text-white w-[90%] text-start flex flex-col items-center sm:w-[50%] mx-auto mt-8'>
          {/* title part */}
          <div className='border-b border-(--auth-text) mb-5'>
            <h1 className='text-xl font-semibold mb-2'>{isLogin ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className='text-sm text-(--auth-text) mb-2'>{isLogin ? "Continue organizing tasks, managing projects, and collaborating with your team seamlessly." : "Organize your work, track tasks, and collaborate with your team in one place."}</p>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col'>
            {isLogin ? "" : <>
              <label className={labelStyle} htmlFor="name">Full name*</label>
              <input className={inputStyle} id='name' value={authData.name} onChange={(e) => setAuthData((prev) => ({ ...prev, name: e.target.value }))} type="text" placeholder='Enter your full name...' />
            </>}


            <label className={labelStyle} htmlFor="email">Email address*</label>
            <input className={inputStyle} id='email' value={authData.email} onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))} type="text" placeholder='Enter your email address...' />

            <label className={labelStyle} htmlFor="password">Password*</label>
            <div className='relative'>
              <input className={inputStyle} id='password' value={authData.password} onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))} type={isPasswordHidden ? 'password' : 'text'} placeholder='Enter a secure password...' />

              {isPasswordHidden ? <FaRegEye className='absolute right-2 top-3 cursor-pointer' onClick={() => setIsPasswordHidden(false)} /> : <FaRegEyeSlash className='absolute right-2 top-3 cursor-pointer' onClick={() => setIsPasswordHidden(true)} />}
            </div>

            <p className='text-(--auth-text) text-sm'>Password must be at least more than 3</p>

            <button className='bg-(--auth-primary) py-[0.4rem] rounded-lg my-4 cursor-pointer hover:bg-(--auth-primary-hover)'>{isLogin ? "Login" : 'Create account'}</button>

            <div className='text-(--auth-text) text-center'>{isLogin ? "Don’t have an account?" : "Already have an account?"} <span onClick={() => setIsLogin(prev => !prev)} className='text-(--auth-primary) underline underline-offset-4 cursor-pointer hover:text-(--auth-primary-hover)'>{isLogin ? "Sign up" : "Log in"}</span></div>

            <div className='mt-2 text-sm text-(--auth-text) text-center'>{isLogin ? "By continuing, you agree to our" : "By signing up, you agree to our"} <span className="text-white
            ">Terms</span> and <span className="text-white
            ">Privacy Policy</span></div>
          </form>

        </div>
      </div>

    </div >
  )
}
