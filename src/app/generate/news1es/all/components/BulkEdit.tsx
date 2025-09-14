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

import { INews1es } from '../store/data/data'
import { useNews1esStore } from '../store/store'
import { useBulkUpdateNews1esMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkEditNextComponents: React.FC = () => {
    const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } =
        useNews1esStore()
    const [bulkUpdateNews1es, { isLoading }] = useBulkUpdateNews1esMutation()

    const handleBulkEditNews1es = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdateNews1es(newBulkData).unwrap()
            toggleBulkEditModal(false)
            setBulkData([])
            handleSuccess('Edit Successful')
        } catch (error) {
            console.error('Failed to edit news1es:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
        setBulkData(
            bulkData.map((news1) =>
                news1._id === itemId
                    ? { ...news1, [fieldName]: value }
                    : news1
            ) as INews1es[]
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
                        news1es.
                    </p>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((news1, idx) => (
                            <div
                                key={(news1._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(news1 as any)['title1'] as string || ''}
                                </span>
                                
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
                        onClick={handleBulkEditNews1es}
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
