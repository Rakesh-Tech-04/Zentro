import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/axios'
import { useNavigate } from 'react-router-dom'
import { CreateBoardModal } from '../components/CreateBoardModal'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { UseSortableForBoard } from '../components/UseSortableForBoard'
import { toast } from 'react-toastify'

export const Dashboard = () => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    let fetchBoardApi = async () => {
        let res = await api.get('boards')
        return res.data
    }

    let { data, isPending, error } = useQuery({
        queryKey: ['boards'],
        queryFn: fetchBoardApi
    })

    const handleDrag = (event) => {
        let { active, over } = event
        if (!over || active.id === over.id) return
        queryClient.setQueryData(['boards'], (boards) => {
            const oldIndex = boards.findIndex(board => board === active.id)
            const newIndex = boards.findIndex(board => board === over.id)
            return arrayMove(boards, oldIndex, newIndex)
        })
    }
    if (isPending) return <div>...Loading</div>
    if (error) return <div>...Something</div>
    
    return (

        <div className='bg-(--bg) min-h-screen text-(--text)'>
            <Navbar />

            <DndContext sensors={sensors} onDragEnd={handleDrag} collisionDetection={closestCenter}>
                {/* boards */}
                <div className='flex gap-3 mt-4 flex-wrap mx-4'>
                    <SortableContext strategy={rectSortingStrategy} items={data}>
                        {data?.map((board) =>
                            <UseSortableForBoard key={board._id} board={board} />
                        )}
                    </SortableContext>
                    <div className='h-28 w-47 rounded-lg overflow-hidden cursor-pointer bg-black grid place-content-center' onClick={() => { setIsOpen(true) }}>
                        <h1 className='w-full  px-2 py-1'>Create new Board</h1>
                    </div>
                    <CreateBoardModal isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </DndContext>

        </div >
    )
}
