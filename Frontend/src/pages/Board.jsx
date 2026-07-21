import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/axios'
import { BsThreeDots } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Lists } from '../components/Lists'
import { TitleForAction } from '../components/TitleForAction'
import { ButtonForAction } from '../components/ButtonForAction'

export const Board = () => {
  let navigate = useNavigate()
  const queryClient = useQueryClient()
  let { boardId } = useParams()
  let [isBoardAction, setisBoardAction] = useState(null)
  let [boardTitle, setBoardTitle] = useState("")

  let actionRef = useRef(null)
  useEffect(() => {
    if (isBoardAction) {
      actionRef.current.focus()
    }
  }, [isBoardAction])

  // fetch board
  let fetchBoardFn = async () => {
    let res = await api.get(`boards/${boardId}`)
    return res.data
  }

  let BoardQuery = useQuery({
    queryKey: ['board', boardId],
    queryFn: fetchBoardFn
  })

  useEffect(() => {
    if (BoardQuery.data) {
      setBoardTitle(BoardQuery.data.title)
    }
  }, [BoardQuery.data])

  // board on success funtion

  const boardOnSuccess = () => {
    queryClient.invalidateQueries(['boards'])
  }

  // delete board
  let deleteBoardFn = async () => {
    let res = await api.delete(`boards/${boardId}`)
    return res.data
  }

  let deleteBoardMutation = useMutation({
    mutationFn: deleteBoardFn,
    onSuccess: boardOnSuccess
  })

  let deleteBoard = () => {
    deleteBoardMutation.mutate(boardId)
    navigate('/')
  }

  // update board

  let updateBoardFn = async (board) => {
    let res = await api.put(`boards/${boardId}`, board)
    return res.data
  }

  let updateBoardMutation = useMutation({
    mutationFn: updateBoardFn,
    onSuccess: boardOnSuccess
  })

  let updateBoard = () => {
    updateBoardMutation.mutate({ title: boardTitle })
  }

  if (BoardQuery.isPending) return <div>...Loading</div>
  if (BoardQuery.isError) return <div>Something</div>

  return (
    <div className='bg-(--bg) text-(--text) min-h-screen p-1'>
      <Navbar />

      <div className='border rounded-2xl overflow-hidden mx-2'>

        {/* board section */}
        <div className='p-4 bg-blue-300 flex justify-between items-center relative'>
          <input type='text' className='text-xl font-semibold' value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} onBlur={updateBoard} onKeyDown={(e) => { e.key === 'Enter' && e.target.blur() }} />

          <BsThreeDots className='cursor-pointer' onClick={() => {
            setisBoardAction(true)
          }
          } />

          {/* board action */}
          {isBoardAction &&
            <div tabIndex={0} ref={actionRef} onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setisBoardAction(null)
              }
            }}
              className='absolute bg-(--action-bg) text-(--text) top-8 right-9 outline-none z-1 rounded-lg overflow-hidden'>

              <TitleForAction title={'Menu'} setIsAction={setisBoardAction} />
              <ButtonForAction onClick={deleteBoard} title={'Delete'} />

            </div>}
        </div>

        {/* list section */}
        <Lists boardId={boardId} />
      </div >
    </div >
  )
}
