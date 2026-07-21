import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/axios';
import { List } from './List';
import { FiPlus } from "react-icons/fi";
import { DndContext, useSensor, PointerSensor, useSensors, closestCorners } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, } from '@dnd-kit/sortable'

export const Lists = ({ boardId }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    let [isList, setIsList] = useState({ title: "", bg: 'white' })
    let queryClient = useQueryClient()

    // list fetch

    let fetchListFn = async () => {
        let res = await api.get(`boards/${boardId}/lists`)
        return res.data
    }

    let listQueries = useQuery({
        queryKey: ['lists', boardId],
        queryFn: fetchListFn
    })

    // list create

    let createListFn = async (list) => {
        let res = await api.post(`boards/${boardId}/lists`, list)
        return res.data
    }

    let createListMutation = useMutation({
        mutationFn: createListFn,
        onMutate: async (list) => {
            await queryClient.cancelQueries(['lists', boardId])

            let previousLists = queryClient.getQueryData(['lists', boardId])

            queryClient.setQueryData(['lists', boardId], (lists) => {
                return [...lists, list]
            })

            return { previousLists }
        },
        onError: (error, list, context) => {
            queryClient.setQueryData(['lists', boardId], context.previousLists)
        },
        onSuccess: () => { queryClient.invalidateQueries(['lists', boardId]) }
    })

    let createList = () => {
        createListMutation.mutate(isList)
        setIsList({ title: "", bg: 'white' })
    }

    // fetch cards

    let fetchCardFn = async () => {
        let res = await api.get(`boards/${boardId}/cards`)
        return res.data
    }

    let cardQueries = useQuery({
        queryKey: ['cards', boardId],
        queryFn: fetchCardFn
    })

    if (listQueries.isPending) return <div>...Loading</div>
    if (listQueries.error) return <div>...Loading</div>

    const handleDrag = (event) => {
        let { over, active } = event
        if (!over || over.id === active.id) return
        let type = active.data.current.type
        if (type === 'list') {
            queryClient.setQueryData(['lists', boardId], (lists) => {
                const oldIndex = lists.findIndex(list => list._id === active.id)
                const newIndex = lists.findIndex(list => list._id === over.id)
                return arrayMove(lists, oldIndex, newIndex)
            })
        }
        else if (type === 'card') {
            queryClient.setQueryData(['cards', boardId], (cards) => {
                const oldIndex = cards.findIndex(card => card._id === active.id)
                const newIndex = cards.findIndex(card => card._id === over.id)
                return arrayMove(cards, oldIndex, newIndex)
            })
        }
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDrag} collisionDetection={closestCorners}>
            <div className='flex flex-wrap m-4 items-start text-white px-3 py-2 rounded-lg gap-4'>
                <SortableContext strategy={rectSortingStrategy} items={listQueries.data?.map((list) => list._id) || []}>
                    {listQueries.data?.map((list) =>
                        <List key={list._id} boardId={boardId} list={list} cards={cardQueries.data?.filter((cards) => cards.list === list._id)} />
                    )}
                </SortableContext>
                {/* add list */}
                <div className='w-55 bg-black text-white rounded-lg'>
                    <input name='list' type="text" className='w-[90%] border rounded mx-[5%] my-2 py-0.5 px-2' value={isList.title} onChange={(e) => setIsList((prev) => ({ ...prev, title: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && createList()} />
                    <button onClick={createList} className='flex text-(--button-text-color) items-center gap-2 cursor-pointer w-full rounded p-2 my-1'><FiPlus /> Add another list</button>
                </div>

            </div>
        </DndContext>
    )
}
