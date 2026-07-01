import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'

export const UseSortableForBoard = ({ board }) => {
    let navigate = useNavigate()
    let { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: board})

    let style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    }

    const handleClick = (boardId) => {
        navigate(`${boardId}`)
    }
    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style} onClick={() => handleClick(board._id)} className='w-47 rounded-lg overflow-hidden'>
            <div className='bg-white w-full h-20'>

            </div>
            <h1 className='w-full bg-black px-2 py-1'>{board.title}</h1>
        </div>
    )
}
