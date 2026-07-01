import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/axios'

export const CardUpdateModal = ({ isOpen, setIsOpen, card, boardId }) => {
    let queryClient = useQueryClient()
    let [isCard, setIsCard] = useState(card)
    let [isFocused, setIsFocused] = useState(false)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const updateCardFn = async (data) => {
        let res = await api.put(`cards/${card._id}`, data)
    }

    const updateCardMutation = useMutation({
        mutationFn: updateCardFn,
        onSuccess: () => { queryClient.invalidateQueries(['cards', boardId]) }
    })

    const updateCard = () => {
        updateCardMutation.mutate(isCard)
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
                            <DialogTitle as="h3" className="text-base/7 font-medium text-black bg-gray-400 inline p-1 rounded-lg">
                                {card.title}
                            </DialogTitle>
                            <div className='mt-4'>
                                <input type="text" className='rounded-lg py-1 px-2' value={isCard.title} onChange={(e) => setIsCard((prev) => ({ ...prev, title: e.target.value }))} onBlur={updateCard} onKeyDown={(e) => {
                                    e.key === 'Enter' && e.target.blur()
                                }} />
                            </div>


                            <div className="mt-4 flex flex-col gap-3">
                                <h1>Description</h1>
                                <textarea className='rounded-xl p-2' value={isCard.description} onChange={(e) => { setIsCard((prev) => ({ ...prev, description: e.target.value })) }}
                                    rows={isFocused ? 10 : 1}
                                    onFocus={() => { setIsFocused(true) }}
                                />
                                <Button
                                    className="inline items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        updateCard()
                                        setIsFocused(false)
                                    }}
                                >
                                    save
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
