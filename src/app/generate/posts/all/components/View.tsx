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

import { IPosts, defaultPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { useGetPostsByIdQuery } from '../redux/rtk-Api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPost,
        toggleViewModal,
        setSelectedPost,
    } = usePostsStore()

    const { data: postData, refetch } = useGetPostsByIdQuery(
        selectedPost?._id,
        { skip: !selectedPost?._id }
    )

    useEffect(() => {
        if (selectedPost?._id) {
            refetch()
        }
    }, [selectedPost?._id, refetch])

    useEffect(() => {
        if (postData?.data) {
            setSelectedPost(postData.data)
        }
    }, [postData, setSelectedPost])

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
                    <DialogTitle>Post Details</DialogTitle>
                </DialogHeader>
                {selectedPost && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedPost['title']} />
                            <DetailRow label="Email" value={selectedPost['email']} />
                            <DetailRow label="Password" value={selectedPost['password']} />
                            <DetailRow label="Passcode" value={selectedPost['passcode']} />
                            <DetailRow label="Area" value={selectedPost['area']} />
                            <DetailRowArray label="Books List" values={selectedPost['books-list']} />
                            <DetailRowArray label="Check List" values={selectedPost['check-list']} />
                            <DetailRow label="Sub Area" value={selectedPost['sub-area']} />
                            <DetailRow label="Description" value={selectedPost['description']} />
                            <DetailRow label="Age" value={selectedPost['age']} />
                            <DetailRow label="Amount" value={selectedPost['amount']} />
                            <DetailRow label="IsActive" value={formatBoolean(selectedPost['isActive'])} />
                            <DetailRow label="Start Date" value={formatDate(selectedPost['start-date'])} />
                            <DetailRow label="Start Time" value={selectedPost['start-time']} />
                            <DetailRow label="Schedule Date" value={`${formatDate(selectedPost['schedule-date']?.start)} to ${formatDate(selectedPost['schedule-date']?.end)}`} />
                            <DetailRow label="Schedule Time" value={`${selectedPost['schedule-time']?.start || 'N/A'} to ${selectedPost['schedule-time']?.end || 'N/A'}`} />
                            <DetailRow
                                label="Favorite Color"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selectedPost['favorite-color']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selectedPost['favorite-color'] }}
                                        />
                                    </div>
                                }
                            />
                            <DetailRow label="Number" value={selectedPost['number']} />
                            <DetailRow label="Profile" value={selectedPost['profile']} />
                            <DetailRow label="Test" value={selectedPost['test']} />
                            <DetailRow label="Info" value={selectedPost['info']} />
                            <DetailRow label="Shift" value={selectedPost['shift']} />
                            <DetailRow label="Policy" value={formatBoolean(selectedPost['policy'])} />
                            <DetailRowArray label="Hobbys" values={selectedPost['hobbys']} />
                            <DetailRow label="Created At" value={formatDate(selectedPost.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPost.updatedAt)} />
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">Products Images</h3>
                            {Array.isArray(selectedPost['products-images']) && selectedPost['products-images'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedPost['products-images'].map((image: string, index: number) => (
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
                            {selectedPost['personal-image'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedPost['personal-image']}
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
                            setSelectedPost(defaultPosts as IPosts)
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
