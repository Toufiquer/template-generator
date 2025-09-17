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

import { ITest2s } from '../store/data/data'
import { useTest2sStore } from '../store/store'
import { useBulkUpdateTest2sMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        useTest2sStore()
    const [bulkUpdateTest2s, { isLoading }] = useBulkUpdateTest2sMutation()

    const handleBulkEditTest2s = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdateTest2s(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit test2s:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
        setBulkData(
            bulkData.map((test2) =>
                test2._id === itemId
                    ? { ...test2, [fieldName]: value }
                    : test2
            ) as ITest2s[]
        )
    }

    return (
        <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <p className="pt-4">
                        You are about to update{' '}
                        <span className="font-semibold">
                            ({bulkData.length})
                        </span>{' '}
                        test2s.
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((test2, idx) => (
                            <div
                                key={(test2._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(test2 as any)['title'] as string || ''}
                                </span>
                                
                                <div className="flex items-center gap-4 min-w-[180px]">
                                    <Label htmlFor="edit-area">Area</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            handleFieldChange(
                                                test2._id as string,
                                                'area',
                                                value
                                            )
                                        }
                                        defaultValue={
                                            (test2['area'] as string) || ''
                                        }
                                    >
                                        <SelectTrigger className="bg-slate-50">
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-50">
                                            {/* Note: Options are hardcoded as they are not in the JSON schema */}
                                            <SelectItem value="Option 1" className="cursor-pointer hover:bg-slate-200">Option 1</SelectItem>
                                            <SelectItem value="Option 2" className="cursor-pointer hover:bg-slate-200">Option 2</SelectItem>
                                            <SelectItem value="Option 3" className="cursor-pointer hover:bg-slate-200">Option 3</SelectItem>
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
                        onClick={handleBulkEditTest2s}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkEditNextComponents
