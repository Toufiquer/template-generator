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

import { IMvs2, defaultMvs2 } from '../store/data/data'
import { useMvs2Store } from '../store/store'
import { useGetMvs2ByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedMvs2,
        toggleViewModal,
        setSelectedMvs2,
    } = useMvs2Store()

    const { data: mv2Data, refetch } = useGetMvs2ByIdQuery(
        selectedMvs2?._id,
        { skip: !selectedMvs2?._id }
    )

    useEffect(() => {
        if (selectedMvs2?._id) {
            refetch()
        }
    }, [selectedMvs2?._id, refetch])

    useEffect(() => {
        if (mv2Data?.data) {
            setSelectedMvs2(mv2Data.data)
        }
    }, [mv2Data, setSelectedMvs2])

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
                    <DialogTitle>Mvs2 Details</DialogTitle>
                </DialogHeader>
                {selectedMvs2 && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedMvs2['title']} />
                            <DetailRow label="Created At" value={formatDate(selectedMvs2.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedMvs2.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedMvs2(defaultMvs2 as IMvs2)
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
