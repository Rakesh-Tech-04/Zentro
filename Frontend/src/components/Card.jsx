import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from '../utils/axios'
import { RxCross2 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { CardUpdateModal } from './CardUpdateModal';
import { TitleForAction } from './TitleForAction';
import { ButtonForAction } from './ButtonForAction';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export const Card = ({ card, boardId }) => {
  let queryClient = useQueryClient()
  let [CardAction, setCardAction] = useState(null)
  let [isOpen, setIsOpen] = useState(false)
  let actionRef = useRef(null)

  let { transform, transition, attributes, listeners, setNodeRef } = useSortable({ id: card._id, data: { type: 'card' } })

  let style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
  }

  useEffect(() => {
    if (CardAction) {
      actionRef.current?.focus();
    }
  }, [CardAction]);


  let cardOnSuccess = () => {
    queryClient.invalidateQueries(['cards', boardId])
  }

  // delete card
  let deleteCardFn = async () => {
    let res = await api.delete(`cards/${card._id}`)
    return res.data
  }

  let deleteCardMutation = useMutation({
    mutationFn: deleteCardFn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['cards', boardId] })

      const previousCards = queryClient.getQueryData(['cards', boardId])

      queryClient.setQueryData(['cards', boardId], (cards) => {
        return cards.filter((card) => card._id !== id)
      })

      return { previousCards }
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['cards', boardId], context.previousCards)
    }
  })

  return (

    <div style={style} {...attributes} {...listeners} ref={setNodeRef} className='border-2 border-(--primary) p-2 my-2 rounded-lg cursor-pointer bg-(--primary) hover:border-blue-400 hover:border-2 relative'>

      <div className='flex items-center justify-between group' onClick={() => { setIsOpen(true) }}>
        <h1>{card.title}</h1>
        <FaRegEdit className='hidden group-hover:block' onClick={(e) => {
          e.stopPropagation()
          setCardAction(card._id)
        }} />
      </div>
      <CardUpdateModal isOpen={isOpen} setIsOpen={setIsOpen} card={card} />

      {/* card action */}
      {
        CardAction == card._id &&
        <div ref={actionRef} tabIndex={0} onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setCardAction(null);
          }
        }} className='absolute top-5 right-5 border-none bg-(--action-bg) text-(--text) outline-none z-1 rounded-lg overflow-hidden' >
          <TitleForAction title={'Card Action'} setIsAction={setCardAction} />

          <ButtonForAction title={'Delete'} onClick={() => { deleteCardMutation.mutate(card._id) }} />
        </div>
      }
    </div >
  )
}
