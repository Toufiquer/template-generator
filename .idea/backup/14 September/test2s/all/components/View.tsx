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

import { ITest2s, defaultTest2s } from '../store/data/data'
import { useTest2sStore } from '../store/store'
import { useGetTest2sByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedTest2s,
        toggleViewModal,
        setSelectedTest2s,
    } = useTest2sStore()

    const { data: test2Data, refetch } = useGetTest2sByIdQuery(
        selectedTest2s?._id,
        { skip: !selectedTest2s?._id }
    )

    useEffect(() => {
        if (selectedTest2s?._id) {
            refetch()
        }
    }, [selectedTest2s?._id, refetch])

    useEffect(() => {
        if (test2Data?.data) {
            setSelectedTest2s(test2Data.data)
        }
    }, [test2Data, setSelectedTest2s])

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
                    <DialogTitle>Test2s Details</DialogTitle>
                </DialogHeader>
                {selectedTest2s && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedTest2s['title']} />
                            <DetailRow label="Email" value={selectedTest2s['email']} />
                            <DetailRow label="Password" value={selectedTest2s['password']} />
                            <DetailRow label="Passcode" value={selectedTest2s['passcode']} />
                            <DetailRow label="Area" value={selectedTest2s['area']} />
                            <DetailRowArray label="Books List" values={selectedTest2s['books-list']} />
                            <DetailRowArray label="Check List" values={selectedTest2s['check-list']} />
                            <DetailRow label="Sub Area" value={selectedTest2s['sub-area']} />
                            <DetailRow label="Description" value={selectedTest2s['description']} />
                            <DetailRow label="Age" value={selectedTest2s['age']} />
                            <DetailRow label="Amount" value={selectedTest2s['amount']} />
                            <DetailRow label="IsActive" value={formatBoolean(selectedTest2s['isActive'])} />
                            <DetailRow label="Start Date" value={formatDate(selectedTest2s['start-date'])} />
                            <DetailRow label="Start Time" value={selectedTest2s['start-time']} />
                            <DetailRow label="Schedule Date" value={`${formatDate(selectedTest2s['schedule-date']?.start)} to ${formatDate(selectedTest2s['schedule-date']?.end)}`} />
                            <DetailRow label="Schedule Time" value={`${selectedTest2s['schedule-time']?.start || 'N/A'} to ${selectedTest2s['schedule-time']?.end || 'N/A'}`} />
                            <DetailRow
                                label="Favorite Color"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selectedTest2s['favorite-color']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selectedTest2s['favorite-color'] }}
                                        />
                                    </div>
                                }
                            />
                            <DetailRow label="Number" value={selectedTest2s['number']} />
                            <DetailRow label="Profile" value={selectedTest2s['profile']} />
                            <DetailRow label="Test" value={selectedTest2s['test']} />
                            <DetailRow label="Info" value={selectedTest2s['info']} />
                            <DetailRow label="Shift" value={selectedTest2s['shift']} />
                            <DetailRow label="Policy" value={formatBoolean(selectedTest2s['policy'])} />
                            <DetailRowArray label="Hobbys" values={selectedTest2s['hobbys']} />
                            <DetailRow label="Ideas" value={selectedTest2s['ideas']} />
                            <DetailRow label="Created At" value={formatDate(selectedTest2s.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedTest2s.updatedAt)} />
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">Products Images</h3>
                            {Array.isArray(selectedTest2['products-images']) && selectedTest2['products-images'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedTest2['products-images'].map((image: string, index: number) => (
                                        <div
                                            key={`${index}-${image}`}
                                            className="relative w-full h-32 border rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                layout="fill"
                                                objectFit="cover"
                                                alt={`Image ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No images provided.</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">Personal Image</h3>
                            {selectedTest2['personal-image'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedTest2['personal-image']}
                                        layout="fill"
                                        objectFit="cover"
                                        alt="Personal Image"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No image provided.</p>
                            )}
                        </div>
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedTest2s(defaultTest2s as ITest2s)
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
