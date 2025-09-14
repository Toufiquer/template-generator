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

import { INews1es, defaultNews1es } from '../store/data/data'
import { useNews1esStore } from '../store/store'
import { useGetNews1esByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedNews1es,
        toggleViewModal,
        setSelectedNews1es,
    } = useNews1esStore()

    const { data: news1Data, refetch } = useGetNews1esByIdQuery(
        selectedNews1es?._id,
        { skip: !selectedNews1es?._id }
    )

    useEffect(() => {
        if (selectedNews1es?._id) {
            refetch()
        }
    }, [selectedNews1es?._id, refetch])

    useEffect(() => {
        if (news1Data?.data) {
            setSelectedNews1es(news1Data.data)
        }
    }, [news1Data, setSelectedNews1es])

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
                    <DialogTitle>News1es Details</DialogTitle>
                </DialogHeader>
                {selectedNews1es && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title1" value={selectedNews1es['title1']} />
                            <DetailRow label="Title2" value={selectedNews1es['title2']} />
                            <DetailRow label="Title3" value={selectedNews1es['title3']} />
                            <DetailRow label="Title4" value={selectedNews1es['title4']} />
                            <DetailRow label="Title5" value={selectedNews1es['title5']} />
                            <DetailRow label="Title6" value={selectedNews1es['title6']} />
                            <DetailRow label="Created At" value={formatDate(selectedNews1es.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedNews1es.updatedAt)} />
                        </div>
                        
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedNews1es(defaultNews1es as INews1es)
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
