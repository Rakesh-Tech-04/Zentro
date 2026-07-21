import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import { setAccesstoken, useUser } from '../utils/UserContext';
import { api } from '../utils/axios';
import { CreateBoardModal } from './CreateBoardModal';

export const Navbar = () => {
    let navigate = useNavigate()
    let [isOpen, setIsOpen] = useState(false)
    let { setUserData } = useUser()
    let [isUserMenu, setIsUserMenu] = useState(false)

    const handleLogout = async () => {
        await api.delete('auth/logout')
            .then(() => {
                setUserData(null)
                setAccesstoken(null)
                navigate('/auth')
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
            })
    }

    return (
        <div className='flex justify-between items-center p-2 '>
            {/* left section */}
            <NavLink to={'/'} className='flex items-center gap-2'><img src="https://img.magnific.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" className='w-10' />Zentro</NavLink>

            {/* mid section */}
            <div>
                <input className='mr-2 w-[50vw] border rounded px-2 py-1 bg-gray-800' type="text" placeholder="Search" />
                <button onClick={() => setIsOpen(true)} className={'bg-(--button-primary) text-(--button-text) py-1 px-2 rounded-md cursor-pointer'}>Create</button>
                <CreateBoardModal isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            {/* right section */}
            <div className='relative'>
                <div className='bg-orange-300 text-black w-8 h-8 flex justify-center items-center rounded-[50%] text-lg cursor-pointer' onClick={() => setIsUserMenu((prev) => !prev)}>
                    RS
                </div>

                {isUserMenu && <div className='bg-white text-black flex flex-col px-1 py-2 rounded-lg absolute z-1 right-2 top-9'>
                    <NavLink to={'/auth'}>Login</NavLink>
                    <button className='cursor-pointer' onClick={handleLogout}>Logout</button>
                </div>
                }
            </div>

        </div>
    )
}
