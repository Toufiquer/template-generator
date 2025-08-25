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

import { IAccesses, defaultAccesses } from '../api/v1/model'
import { useAccessesStore } from '../store/store'
import { useGetAccessesByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedAccesses,
        toggleViewModal,
        setSelectedAccesses,
    } = useAccessesStore()

    const { data: accessData, refetch } = useGetAccessesByIdQuery(
        selectedAccesses?._id,
        { skip: !selectedAccesses?._id }
    )

    useEffect(() => {
        if (selectedAccesses?._id) {
            refetch()
        }
    }, [selectedAccesses?._id, refetch])

    useEffect(() => {
        if (accessData?.data) {
            setSelectedAccesses(accessData.data)
        }
    }, [accessData, setSelectedAccesses])

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
            <div className="font-semibold text-sm text-gray-600">{label}</div>
            <div className="col-span-2 text-sm">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Accesses Details</DialogTitle>
                </DialogHeader>
                {selectedAccesses && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Student" value={selectedAccesses['student']} />
                            <DetailRow label="Admin" value={selectedAccesses['admin']} />
                            <DetailRow label="Moderator" value={selectedAccesses['moderator']} />
                            <DetailRow label="Mentor" value={selectedAccesses['mentor']} />
                            <DetailRow label="Instructor" value={selectedAccesses['instructor']} />
                            <DetailRow label="Created At" value={formatDate(selectedAccesses.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedAccesses.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedAccesses(defaultAccesses as IAccesses)
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
