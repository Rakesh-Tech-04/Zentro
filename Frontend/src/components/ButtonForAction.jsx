import React from 'react'

export const ButtonForAction = ({ onClick, title }) => {
    return (
        <button onClick={onClick} className='w-full cursor-pointer text-start pl-3 py-1 hover:bg-(--action-bg-hover) mb-2'>{title}</button>
    )
}
