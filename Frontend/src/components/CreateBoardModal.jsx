import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/axios'

export const CreateBoardModal = ({ isOpen, setIsOpen }) => {
    let [isBoard, setIsBoard] = useState({ title: "", bg: "white" })
    let queryClient = useQueryClient()

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    let createBoardFn = async (data) => {
        let res = await api.post('boards', data)
        return res.data
    }
    let createBoardMutation = useMutation({
        mutationFn: createBoardFn,
        onMutate: async (Board) => {
            await queryClient.cancelQueries(['boards'])

            let previousBoards = queryClient.getQueryData(['boards'])

            queryClient.setQueryData(['boards'], (boards) => {
                return [...boards, Board]
            })
            return { previousBoards }
        },

        onError: (error, board, context) => {
            queryClient.setQueryData(['boards'], context.previousBoards)
        },

        onSuccess: () => { queryClient.invalidateQueries(['boards']) }
    })
    let createBoard = () => {
        createBoardMutation.mutate(isBoard)
        setIsOpen(false)
        setIsBoard({ title: "", bg: "white" })
    }

    return (
        <>
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none text-(--text)" onClose={close} __demoMode>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Create Board
                            </DialogTitle>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="">Board title</label>
                                <input autoFocus type="text" className='border rounded-lg py-1 px-2' value={isBoard.title} onChange={(e) => { setIsBoard((prev) => ({ ...prev, title: e.target.value })) }} onKeyDown={(e) => { e.key === 'Enter' && createBoard() }} />
                            </div>
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={createBoard}
                                >
                                    Create Board
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
