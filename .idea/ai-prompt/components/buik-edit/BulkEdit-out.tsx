import React from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { postsSelectorArr } from '../store/StoreConstants'
import { useBulkUpdatePostsMutation } from '../redux/rtk-Api'

import { handleSuccess } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        usePostsStore()
    const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation()

    const handleBulkEditPosts = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdatePosts(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit posts:', error)
        }
    }

    const handleRoleChange = (PostsId: string, role: string) => {
        setBulkData(
            bulkData.map((Posts) =>
                Posts._id === PostsId ? { ...Posts, role } : Posts
            ) as IPosts[]
        )
    }

    return (
        <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <p className="pt-4">
                        You are about to update{' '}
                        <span className="font-semibold">
                            ({bulkData.length})
                        </span>{' '}
                        Posts
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((Posts, idx) => (
                            <div
                                key={(Posts._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(Posts.name as string) || ''}
                                </span>
                                <div className="flex items-center gap-4 min-w-[180px]">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                        onValueChange={(role) =>
                                            handleRoleChange(
                                                Posts._id as string,
                                                role
                                            )
                                        }
                                        defaultValue={
                                            (Posts.role as string) || ''
                                        }
                                    >
                                        <SelectTrigger className="bg-slate-50">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-50">
                                            {postsSelectorArr?.map(
                                                (role, index) => (
                                                    <SelectItem
                                                        key={role + index}
                                                        value={role}
                                                        className="cursor-pointer hover:bg-slate-200"
                                                    >
                                                        {role}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkEditModal(false)}
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

export default BulkEditNextComponents
