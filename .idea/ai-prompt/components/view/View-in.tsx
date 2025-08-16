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

import { IPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { baseIPosts } from '../store/StoreConstants'
import { useGetPostsByIdQuery } from '../redux/rtk-Api'

import { ViewRichText } from './view-rich-text/ViewRichText'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selectedPosts,
        toggleViewModal,
        setSelectedPosts,
    } = usePostsStore()
    const { data: PostsData, refetch } = useGetPostsByIdQuery(
        selectedPosts?._id,
        { skip: !selectedPosts?._id }
    )

    useEffect(() => {
        if (selectedPosts?._id) {
            refetch() // Fetch the latest Posts data
        }
    }, [selectedPosts?._id, refetch])

    useEffect(() => {
        if (PostsData?.data) {
            setSelectedPosts(PostsData.data) // Update selectedPosts with the latest data
        }
    }, [PostsData, setSelectedPosts])

    const formatDate = (date?: Date) =>
        date ? format(date, 'MMM dd, yyyy') : 'N/A'

    const DetailRow = ({
        label,
        value,
    }: {
        label: string
        value: React.ReactNode
    }) => (
        <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">{label}:</div>
            <div className="col-span-2">{value || 'N/A'}</div>
        </div>
    )
    const DetailRowArray = ({
        label,
        values,
    }: {
        label: string
        values: string[]
    }) => (
        <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">{label}:</div>
            <div className="col-span-2">{values?.join(', ')}</div>
        </div>
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Posts Details</DialogTitle>
                </DialogHeader>
                {selectedPosts && (
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <div className="w-full flex flex-col">
                            <div className="grid gap-2">
                                <DetailRow
                                    label="Name"
                                    value={selectedPosts.name as string}
                                />
                                <DetailRow
                                    label="Email"
                                    value={selectedPosts.email as string}
                                />
                                <DetailRow
                                    label="Pass Code"
                                    value={selectedPosts.passCode as string}
                                />
                                <DetailRow
                                    label="Alias"
                                    value={selectedPosts.alias as string}
                                />
                                <DetailRow
                                    label="Role"
                                    value={
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedPosts.role === 'admin'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : selectedPosts.role ===
                                                        'moderator'
                                                      ? 'bg-blue-100 text-blue-700'
                                                      : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {selectedPosts.role as string}
                                        </span>
                                    }
                                />
                                <DetailRowArray
                                    label="Data Array"
                                    values={selectedPosts.dataArr as string[]}
                                />
                                <DetailRow
                                    label="Created At"
                                    value={formatDate(selectedPosts.createdAt)}
                                />
                                <DetailRow
                                    label="Updated At"
                                    value={formatDate(selectedPosts.updatedAt)}
                                />
                            </div>
                            <div className="w-full flex items-center justify-center mt-2 min-h-[10vh]">
                                {Array.isArray(selectedPosts.images) &&
                                selectedPosts.images?.length > 0 ? (
                                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                                        {selectedPosts.images.map(
                                            (i, index) => (
                                                <div
                                                    key={index + i}
                                                    className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
                                                >
                                                    <Image
                                                        src={i}
                                                        fill
                                                        alt="Media"
                                                        objectFit="cover"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full items-center justify-center">
                                        <p>Ops! there is no Image</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full m-2" />
                            <ViewRichText
                                data={selectedPosts.descriptions || ''}
                            />
                        </div>
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelectedPosts({
                                ...baseIPosts,
                            } as IPosts)
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
