import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { usePostsStore } from '../store/Store'
import { useBulkUpdatePostsMutation } from '../redux/rtk-Api'

import { handleSuccess } from './utils'
import DynamicDataSelect from './DynamicDataSelect'

const BulkDynamicUpdateNextComponents: React.FC = () => {
    const [newItemTags, setNewItemTags] = useState<string[]>([])
    const {
        toggleBulkDynamicUpdateModal,
        isBulkDynamicUpdateModal,
        bulkData,
        setBulkData,
    } = usePostsStore()
    const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation()

    const handleBulkEditPosts = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: { ...rest, dataArr: newItemTags },
            }))

            await bulkUpdatePosts(newBulkData).unwrap()
            toggleBulkDynamicUpdateModal(false)
            setBulkData([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit posts:', error)
        }
    }

    return (
        <Dialog
            open={isBulkDynamicUpdateModal}
            onOpenChange={toggleBulkDynamicUpdateModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <div>
                        <p className="pt-2">
                            You are about to update{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            posts
                        </p>
                        <div className="w-full flex items-center justify-between pt-2">
                            <DynamicDataSelect
                                label="Update all data as"
                                newItemTags={newItemTags as string[]}
                                setNewItemTags={setNewItemTags}
                            />
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((Posts, idx) => (
                            <div
                                key={(Posts._id as string) || idx}
                                className="flex items-start mb-2 justify-between flex-col"
                            >
                                <div className="flex flex-col">
                                    <span>
                                        {idx + 1}.{' '}
                                        {(Posts.name as string) || ''}
                                    </span>
                                    <span className="text-xs mt-0">
                                        {newItemTags.join(', ') || ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkDynamicUpdateModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEditPosts}
                        className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
                    >
                        Update Selected
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkDynamicUpdateNextComponents
