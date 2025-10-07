import Image from 'next/image'
import { format } from 'date-fns'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ITesta, defaultTesta } from '../store/data/data'
import { useTestaStore } from '../store/store'
import { useGetTestaByIdQuery } from '@/redux/features/testa/testaSlice'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedTesta,
        toggleViewModal,
        setSelectedTesta,
    } = useTestaStore()

    const { data: testaData, refetch } = useGetTestaByIdQuery(
        selectedTesta?._id,
        { skip: !selectedTesta?._id }
    )

    useEffect(() => {
        if (selectedTesta?._id) {
            refetch()
        }
    }, [selectedTesta?._id, refetch])

    useEffect(() => {
        if (testaData?.data) {
            setSelectedTesta(testaData.data)
        }
    }, [testaData, setSelectedTesta])

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No')

    const DetailRow: React.FC<{
        label: string
        value: React.ReactNode
    }> = ({ label, value }) => (
        <div className="grid grid-cols-3 gap-2 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
            <div className="col-span-2 text-sm text-gray-800 dark:text-gray-100">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    // --- NEW HELPER COMPONENT FOR RENDERING JSON ---
    const DetailRowJson: React.FC<{
        label: string
        value?: object | any[]
    }> = ({ label, value }) => (
        <div className="grid grid-cols-1 gap-1 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">{label}</div>
            <div className="col-span-1 text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded-md mt-1">
                <pre className="whitespace-pre-wrap text-xs">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
            </div>
        </div>
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Testa Details</DialogTitle>
                </DialogHeader>
                {selectedTesta && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedTesta['title']} />
                            <DetailRowJson label="Students" value={selectedTesta['students']} />
                            <DetailRow label="Created At" value={formatDate(selectedTesta.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedTesta.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedTesta(defaultTesta as ITesta)
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewNextComponents
