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

import { IPostsb, defaultPostsb } from '../store/data/data'
import { usePostsbStore } from '../store/store'
import { useGetPostsbByIdQuery } from '@/redux/features/postsb/postsbSlice'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPostsb,
        toggleViewModal,
        setSelectedPostsb,
    } = usePostsbStore()

    const { data: postbData, refetch } = useGetPostsbByIdQuery(
        selectedPostsb?._id,
        { skip: !selectedPostsb?._id }
    )

    useEffect(() => {
        if (selectedPostsb?._id) {
            refetch()
        }
    }, [selectedPostsb?._id, refetch])

    useEffect(() => {
        if (postbData?.data) {
            setSelectedPostsb(postbData.data)
        }
    }, [postbData, setSelectedPostsb])

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
                    <DialogTitle>Postsb Details</DialogTitle>
                </DialogHeader>
                {selectedPostsb && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            <DetailRow label="Title" value={selectedPostsb['title']} />
                            <DetailRow label="Email" value={selectedPostsb['email']} />
                            <DetailRow label="Password" value={selectedPostsb['password']} />
                            <DetailRow label="Passcode" value={selectedPostsb['passcode']} />
                            <DetailRow label="Area" value={selectedPostsb['area']} />
                            <DetailRowArray label="Sub Area" values={selectedPostsb['sub-area']} />
                            <DetailRow label="Description" value={selectedPostsb['description']} />
                            <DetailRow label="Age" value={selectedPostsb['age']} />
                            <DetailRow label="Amount" value={selectedPostsb['amount']} />
                            <DetailRow label="IsActive" value={formatBoolean(selectedPostsb['isActive'])} />
                            <DetailRow label="Start Date" value={formatDate(selectedPostsb['start-date'])} />
                            <DetailRow label="Start Time" value={selectedPostsb['start-time']} />
                            <DetailRow label="Schedule Date" value={`${formatDate(selectedPostsb['schedule-date']?.start)} to ${formatDate(selectedPostsb['schedule-date']?.end)}`} />
                            <DetailRow label="Schedule Time" value={`${selectedPostsb['schedule-time']?.start || 'N/A'} to ${selectedPostsb['schedule-time']?.end || 'N/A'}`} />
                            <DetailRow
                                label="Favorite Color"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selectedPostsb['favorite-color']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selectedPostsb['favorite-color'] }}
                                        />
                                    </div>
                                }
                            />
                            <DetailRow label="Number" value={selectedPostsb['number']} />
                            <DetailRow label="Profile" value={selectedPostsb['profile']} />
                            <DetailRow label="Test" value={selectedPostsb['test']} />
                            <DetailRow label="Info" value={selectedPostsb['info']} />
                            <DetailRow label="Shift" value={selectedPostsb['shift']} />
                            <DetailRow label="Policy" value={formatBoolean(selectedPostsb['policy'])} />
                            <DetailRowArray label="Hobbies" values={selectedPostsb['hobbies']} />
                            <DetailRowArray label="Ideas" values={selectedPostsb['ideas']} />
                            <DetailRowJson label="Students" value={selectedPostsb['students']} />
                            <DetailRowJson label="ComplexValue" value={selectedPostsb['complexValue']} />
                            <DetailRow label="Created At" value={formatDate(selectedPostsb.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selectedPostsb.updatedAt)} />
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">Products Images</h3>
                            {Array.isArray(selectedPostsb['products-images']) && selectedPostsb['products-images'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedPostsb['products-images'].map((image: string, index: number) => (
                                        <div
                                            key={`${index}-${image}`}
                                            className="relative w-full h-32 border rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                fill
                                                style={{ objectFit: 'cover' }}
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
                            {selectedPostsb['personal-image'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedPostsb['personal-image']}
                                        fill
                                        style={{ objectFit: 'cover' }}
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
                            setSelectedPostsb(defaultPostsb as IPostsb)
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
