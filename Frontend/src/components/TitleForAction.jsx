import React from 'react'
import { RxCross2 } from "react-icons/rx";

export const TitleForAction = ({ title, setIsAction }) => {
    return (
        <div className='flex items-center w-50 justify-between px-2 py-4'>
            <h1 className='text-center flex-1 font-semibold text-lg'>{title}</h1>
            <RxCross2 className='cursor-pointer' onClick={() => setIsAction(false)} />
        </div>
    )
}
