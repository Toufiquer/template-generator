'use client'

import { format } from 'date-fns'
import React, { useState, useMemo } from 'react'
import { IoReloadCircleOutline } from 'react-icons/io5'
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingComponent from '@/components/common/Loading'
import ErrorMessageComponent from '@/components/common/Error'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { INews1es } from '../store/data/data'
import { pageLimitArr } from '../store/store-constant'
import { useNews1esStore } from '../store/store'
import { useGetNews1esQuery } from '../redux/rtk-api'
import Pagination from './Pagination'
import { handleSuccess } from './utils'

const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof INews1es
        direction: 'asc' | 'desc'
    } | null>(null)
    
    const {
        setSelectedNews1es,
        toggleBulkEditModal,
        toggleBulkUpdateModal,
        toggleViewModal,
        queryPramsLimit,
        toggleBulkDynamicUpdateModal,
        queryPramsPage,
        queryPramsQ,
        toggleEditModal,
        toggleDeleteModal,
        bulkData,
        setBulkData,
        setQueryPramsLimit,
        setQueryPramsPage,
        toggleBulkDeleteModal,
    } = useNews1esStore()

    const {
        data: getResponseData,
        isLoading,
        refetch,
        isError,
        error,
    } = useGetNews1esQuery({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.news1es || [],
        [getResponseData]
    )

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch {
            return 'Invalid Date'
        }
    }

    const handleSort = (key: keyof INews1es) => {
        setSortConfig((prev) =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        )
    }

    const sortedData = useMemo(() => {
        if (!sortConfig) return allData
        return [...allData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]
            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [allData, sortConfig])

    const handleSelectAll = (isChecked: boolean) =>
        setBulkData(isChecked ? allData : [])

    const handleSelectRow = (isChecked: boolean, item: INews1es) =>
        setBulkData(
            isChecked
                ? [...bulkData, item]
                : bulkData.filter((i) => i._id !== item._id)
        )

    const tableHeaders: { key: keyof INews1es; label: string }[] = [
        { key: 'title1', label: 'Title1' },
        { key: 'title2', label: 'Title2' },
        { key: 'title3', label: 'Title3' },
        { key: 'title4', label: 'Title4' },
        { key: 'title5', label: 'Title5' },
        { key: 'title6', label: 'Title6' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const renderActions = (item: INews1es) => (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelectedNews1es(item); toggleViewModal(true); }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedNews1es(item); toggleEditModal(true); }}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setSelectedNews1es(item); toggleDeleteModal(true); }}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    )

    const renderTableRows = () =>
        sortedData.map((item: INews1es) => (
            <TableRow key={item._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(!!checked, item)}
                        checked={bulkData.some((i) => i._id === item._id)}
                    />
                </TableCell>
                <TableCell>{(item as any)['title1']}</TableCell>
                <TableCell>{(item as any)['title2']}</TableCell>
                <TableCell>{(item as any)['title3']}</TableCell>
                <TableCell>{(item as any)['title4']}</TableCell>
                <TableCell>{(item as any)['title5']}</TableCell>
                <TableCell>{(item as any)['title6']}</TableCell>
                <TableCell>{formatDate(item['createdAt'])}</TableCell>
                <TableCell>{renderActions(item)}</TableCell>
            </TableRow>
        ))

    if (isLoading) return <LoadingComponent />
    if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />
    
    return (
        <div className="w-full flex flex-col">
            <div className="w-full my-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b">
                    <div className="flex items-center gap-2 justify-start w-full">
                        <Label>Selected: </Label>
                        <span className="text-sm text-slate-500">({bulkData.length})</span>
                    </div>
                    <div className="flex items-center justify-end w-full gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                            <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                            <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { refetch(); handleSuccess('Reloaded!'); }} disabled={isLoading}>
                            <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
                        </Button>
                    </div>
                </div>
            </div>

            {allData.length === 0 ? (
                 <div className="py-12 text-center text-2xl text-slate-500">Ops! Nothing was found.</div>
            ) : (
                <Table className="border">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={bulkData.length === allData.length && allData.length > 0}
                                />
                            </TableHead>
                            {tableHeaders.map(({ key, label }) => (
                                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key as keyof INews1es)}>
                                    {label}{' '}
                                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderTableRows()}</TableBody>
                </Table>
            )}

            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />

             <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
                <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
                    News1es per page
                </Label>
                <Select
                    onValueChange={(value) => { setQueryPramsLimit(Number(value)); setQueryPramsPage(1); }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="border-0">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default ViewTableNextComponents
