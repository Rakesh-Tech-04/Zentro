import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../utils/axios';
import { Card } from './Card';
import { FiPlus } from "react-icons/fi";
import { TitleForAction } from './TitleForAction';
import { ButtonForAction } from './ButtonForAction';
import { CSS } from '@dnd-kit/utilities';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, closestCenter } from '@dnd-kit/core';

export const List = ({ boardId, list, cards }) => {
  let queryClient = useQueryClient()
  let [ListAction, setListAction] = useState(null)
  let [listData, setListData] = useState({ title: '', bg: 'white' })
  let [isCardInput, setIsCardInput] = useState(false)
  let [cardData, setCardData] = useState({ title: "", bg: 'white', description: '' })

  let { transform, transition, attributes, listeners, setNodeRef } = useSortable({ id: list })

  let style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
  }

  let actionRef = useRef(null)

  useEffect(() => {
    if (ListAction) {
      actionRef.current?.focus()
    }
  }, [ListAction])

  useEffect(() => {
    if (list) {
      setListData({ title: list.title, bg: list.bg })
    }
  }, [list])

  const listOnSuccess = () => {
    queryClient.invalidateQueries(['lists', boardId])
  }

  //update list
  let updateListFn = async (data) => {
    let res = await api.put(`lists/${list._id}`, data)
    return res.data
  }

  let updateListMutation = useMutation({
    mutationFn: updateListFn,
    onSuccess: listOnSuccess,
  })

  let updateList = () => {
    updateListMutation.mutate(listData)
  }

  //delete list

  let deleteListFn = async () => {
    let res = await api.delete(`lists/${list._id}`).catch((err) => { console.log(err) })
    return res.data
  }

  let deleteListMutation = useMutation({
    mutationFn: deleteListFn,
    onMutate: async (id) => {
      // stop any ongoing fetches for this query
      await queryClient.cancelQueries({
        queryKey: ['lists', boardId]
      })

      // save the current data
      const previousLists = queryClient.getQueryData(['lists', boardId])

      queryClient.setQueryData(['lists', boardId], (lists) => { return lists.filter((list) => list._id !== id) })

      return { previousLists }

    },

    // runs if api requist fails
    onError: (error, id, context) => {
      queryClient.setQueryData(['lists', boardId], context.previousLists)
    },

    // onSuccess: (data, id) => {
    //   queryClient.setQueryData(['lists', boardId], (lists) => {
    //     return lists.filter((list) => list._id !== id)
    //   })
    // }

    // runs whether success or error
    // onSettled: () => {
    //   queryClient.invalidateQueries(['lists', boardId])
    // }

  })

  // creat card

  let createCardFn = async (card) => {
    let res = await api.post(`boards/${boardId}/lists/${list._id}/cards`, card).catch((error) => { console.log(error.response) })
    return res.data
  }

  let createCardMutation = useMutation({
    mutationFn: createCardFn,
    onMutate: async (card) => {
      await queryClient.cancelQueries(['cards', boardId])

      let previousCards = queryClient.getQueryData(['cards', boardId])

      queryClient.setQueryData(['cards', boardId], (cards) => {
        return [...cards, card]
      })

      return { previousCards }
    },
    onError: (error, card, context) => {
      queryClient.setQueryData(['cards', boardId], context.previousCards)
    },
    onSuccess: () => { queryClient.invalidateQueries(['cards', boardId]) }
  })

  let createCard = () => {
    createCardMutation.mutate(cardData)
    setCardData({ title: "", bg: 'white' })
    setIsCardInput(null)
  }

  return (
    <div {...attributes} {...listeners} ref={setNodeRef} style={style} className='bg-black py px-2 rounded-lg relative'>
      {/*  list section */}
      <div className='flex justify-between cursor-pointer px-1 py-2'>
        <input className='text-lg w-[50%]' value={listData.title} onChange={(e) => { setListData((prev) => ({ ...prev, title: e.target.value })) }} onBlur={updateList} onKeyDown={(e) => {
          e.key === 'Enter' && e.target.blur()
        }} />
        <BsThreeDots onClick={() => {
          setListAction(list._id)
        }} />

        {/* list action */}

        {ListAction == list._id &&
          <div ref={actionRef} tabIndex={0} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setListAction(null)
            }
          }} className='absolute bg-(--action-bg) text-(--text) top-4 right-5 outline-none z-1 rounded-lg overflow-hidden'>
            <TitleForAction title={"List Action"} setIsAction={setListAction} />
            <ButtonForAction onClick={() => { deleteListMutation.mutate(list._id) }} title={'Delete'} />
          </div>
        }
      </div>

      {/* card section */}
      {
        cards?.map((card) =>
          <Card key={card._id} card={card} boardId={boardId} />
        )
      }
      {/* add card */}
      <div>
        {isCardInput ? <div className='mt-4'>
          <input name='card' value={cardData.title} onChange={(e) => setCardData((prev) => ({ ...prev, title: e.target.value }))} type="text" className='border p-1 rounded h-16' onKeyDown={(e) => { e.key === 'Enter' && createCard() }} autoFocus />
          <div className='flex items-center mt-2 mb-3 mx-1'>
            <button onClick={() => createCard()} className='bg-(--button-primary) text-(--button-text) px-1 py-0.5 mr-2 rounded cursor-pointer'>Add Card</button>
            <RxCross2 className='cursor-pointer' onClick={() => setIsCardInput(false)} />
          </div>
        </div> :
          <button onClick={() => {
            setIsCardInput(true)
          }} className='flex text-(--button-text-color) items-center gap-2 cursor-pointer hover:bg-(--button-hover) w-[90%] rounded my-2 p-1'><FiPlus /> Add a Card</button>
        }
      </div>
    </div>
  )
}
