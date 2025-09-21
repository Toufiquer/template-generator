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

import { IPosts, defaultPosts } from '../store/data/data'
import { usePostsStore } from '../store/store'
import { useGetPostsByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPosts,
        toggleViewModal,
        setSelectedPosts,
    } = usePostsStore()

    const { data: postData, refetch } = useGetPostsByIdQuery(
        selectedPosts?._id,
        { skip: !selectedPosts?._id }
    )

    useEffect(() => {
        if (selectedPosts?._id) {
            refetch()
        }
    }, [selectedPosts?._id, refetch])

    useEffect(() => {
        if (postData?.data) {
            setSelectedPosts(postData.data)
        }
    }, [postData, setSelectedPosts])

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
                    <DialogTitle>Posts Details</DialogTitle>
                </DialogHeader>
                {selectedPosts && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedPosts['title']} />
                            <DetailRow label="Email" value={selectedPosts['email']} />
                            <DetailRow label="Password" value={selectedPosts['password']} />
                            <DetailRow label="Passcode" value={selectedPosts['passcode']} />
                            <DetailRow label="Area" value={selectedPosts['area']} />
                            <DetailRow label="Sub Area" value={selectedPosts['sub-area']} />
                            <DetailRow label="Description" value={selectedPosts['description']} />
                            <DetailRow label="Age" value={selectedPosts['age']} />
                            <DetailRow label="Amount" value={selectedPosts['amount']} />
                            <DetailRow label="IsActive" value={formatBoolean(selectedPosts['isActive'])} />
                            <DetailRow label="Start Date" value={formatDate(selectedPosts['start-date'])} />
                            <DetailRow label="Start Time" value={selectedPosts['start-time']} />
                            <DetailRow label="Schedule Date" value={`${formatDate(selectedPosts['schedule-date']?.start)} to ${formatDate(selectedPosts['schedule-date']?.end)}`} />
                            <DetailRow label="Schedule Time" value={`${selectedPosts['schedule-time']?.start || 'N/A'} to ${selectedPosts['schedule-time']?.end || 'N/A'}`} />
                            <DetailRow
                                label="Favorite Color"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selectedPosts['favorite-color']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selectedPosts['favorite-color'] }}
                                        />
                                    </div>
                                }
                            />
                            <DetailRow label="Number" value={selectedPosts['number']} />
                            <DetailRow label="Profile" value={selectedPosts['profile']} />
                            <DetailRow label="Test" value={selectedPosts['test']} />
                            <DetailRow label="Info" value={selectedPosts['info']} />
                            <DetailRow label="Shift" value={selectedPosts['shift']} />
                            <DetailRow label="Policy" value={formatBoolean(selectedPosts['policy'])} />
                            <DetailRowArray label="Hobbys" values={selectedPosts['hobbys']} />
                            <DetailRow label="Ideas" value={selectedPosts['ideas']} />
                            <DetailRow label="Created At" value={formatDate(selectedPosts.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPosts.updatedAt)} />
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">Products Images</h3>
                            {Array.isArray(selectedPosts['products-images']) && selectedPosts['products-images'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedPosts['products-images'].map((image: string, index: number) => (
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
                            {selectedPosts['personal-image'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedPosts['personal-image']}
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
                            setSelectedPosts(defaultPosts as IPosts)
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
