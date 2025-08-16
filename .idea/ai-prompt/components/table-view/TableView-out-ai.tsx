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

import { IPosts } from '../api/v1/model'
import { pageLimitArr } from '../store/StoreConstants'
import { usePostsStore } from '../store/Store'
import { useGetPostsQuery } from '../redux/rtk-Api'

import Pagination from './Pagination'
import { handleSuccess } from './utils'

const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof IPosts
        direction: 'asc' | 'desc'
    } | null>(null)
    const {
        setSelectedPosts,
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
    } = usePostsStore()

    const {
        data: getResponseData,
        isLoading,
        refetch,
        isError,
        error,
    } = useGetPostsQuery({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allPostsData = useMemo(
        () => getResponseData?.data?.posts || [],
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

    const handleSort = (key: keyof IPosts) => {
        setSortConfig((prev) =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        )
    }

    const sortedPostsData = useMemo(() => {
        if (!sortConfig) return allPostsData
        return [...allPostsData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [allPostsData, sortConfig])

    const handleSelectAll = (isChecked: boolean) =>
        setBulkData(isChecked ? allPostsData : [])

    const handleSelectRow = (isChecked: boolean, post: IPosts) =>
        setBulkData(
            isChecked
                ? [...bulkData, post]
                : bulkData.filter((item) => item._id !== post._id)
        )

    const handlePopUp = () => {
        handleSuccess('Reload Successful')
    }

    const tableHeaders: { key: keyof IPosts; label: string }[] = [
        { key: 'title', label: 'Title' },
        { key: 'email', label: 'Email' },
        { key: 'area', label: 'Area' },
        { key: 'age', label: 'Age' },
        { key: 'amount', label: 'Amount' },
        { key: 'isActive', label: 'Active' },
        { key: 'shift', label: 'Shift' },
        { key: 'createdAt', label: 'Created At' },
    ]

    const renderActions = (post: IPosts) => (
        <div className="flex gap-2">
            <Button
                variant="outlineDefault"
                size="sm"
                onClick={() => {
                    setSelectedPosts(post)
                    toggleViewModal(true)
                }}
            >
                <EyeIcon className="w-4 h-4 mr-1" /> View
            </Button>
            <Button
                variant="outlineDefault"
                size="sm"
                onClick={() => {
                    setSelectedPosts(post)
                    toggleEditModal(true)
                }}
            >
                <PencilIcon className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button
                variant="outlineGarden"
                size="sm"
                onClick={() => {
                    setSelectedPosts(post)
                    toggleDeleteModal(true)
                }}
            >
                <TrashIcon className="w-4 h-4 mr-1" /> Delete
            </Button>
        </div>
    )
    const renderTableRows = () =>
        sortedPostsData.map((post: IPosts) => (
            <TableRow key={post._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) =>
                            handleSelectRow(!!checked, post)
                        }
                        checked={bulkData.some((item) => item._id === post._id)}
                    />
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.email}</TableCell>
                <TableCell>{post.area}</TableCell>
                <TableCell>{post.age}</TableCell>
                <TableCell>{post.amount}</TableCell>
                <TableCell>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {post.isActive ? 'Yes' : 'No'}
                    </span>
                </TableCell>
                <TableCell>{post.shift}</TableCell>
                <TableCell>{formatDate(post.createdAt)}</TableCell>
                <TableCell className="justify-end flex">
                    {renderActions(post)}
                </TableCell>
            </TableRow>
        ))

    if (isLoading) return <LoadingComponent />
    if (isError)
        return <ErrorMessageComponent message={error || 'An error occurred'} />
    if (allPostsData.length === 0)
        return (
            <div className="py-12 text-2xl text-slate-500">
                Ops! Nothing was found.
            </div>
        )

    return (
        <div className="w-full flex flex-col">
            <div className="w-full my-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b-1 border-slat-400">
                    <div className="px-2 gap-2 flex items-center justify-start w-full">
                        Total Selected{' '}
                        <span className="text-xs text-slate-500">
                            ({bulkData.length})
                        </span>
                    </div>
                    <div className="px-2 gap-2 flex items-center justify-end w-full">
                        <Button
                            variant="outlineDefault"
                            size="sm"
                            onClick={() => toggleBulkDynamicUpdateModal(true)}
                            disabled={bulkData.length === 0}
                        >
                            <PencilIcon className="w-4 h-4 mr-1" /> B. Update
                        </Button>
                        <Button
                            variant="outlineDefault"
                            size="sm"
                            onClick={() => toggleBulkUpdateModal(true)}
                            disabled={bulkData.length === 0}
                        >
                            <PencilIcon className="w-4 h-4 mr-1" /> B. Update
                        </Button>
                        <Button
                            variant="outlineDefault"
                            size="sm"
                            onClick={() => toggleBulkEditModal(true)}
                            disabled={bulkData.length === 0}
                        >
                            <PencilIcon className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                            variant="outlineFire"
                            size="sm"
                            onClick={() => toggleBulkDeleteModal(true)}
                            disabled={bulkData.length === 0}
                        >
                            <TrashIcon className="w-4 h-4 mr-1" /> Delete
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-1 bg-green-100 hover:bg-green-200 border-green-300 hover:border-green-400 text-green-400 hover:text-green-500 cursor-pointer "
                            onClick={() => {
                                refetch()
                                handlePopUp()
                            }}
                            disabled={isLoading}
                        >
                            <IoReloadCircleOutline className="w-4 h-4 mr-1" />{' '}
                            Reload
                        </Button>
                    </div>
                </div>
            </div>
            <Table className="border-1 border-slate-500">
                <TableHeader className="bg-slate-600 text-slate-50 rounded overflow-hidden border-1 border-slate-600">
                    <TableRow>
                        <TableHead>
                            <Checkbox
                                onCheckedChange={(checked) =>
                                    handleSelectAll(!!checked)
                                }
                                checked={
                                    bulkData.length === allPostsData.length &&
                                    allPostsData.length > 0
                                }
                            />
                        </TableHead>
                        {tableHeaders.map(({ key, label }) => (
                            <TableHead
                                key={key}
                                className={`font-bold text-slate-50 cursor-pointer`}
                                onClick={() => handleSort(key as keyof IPosts)}
                            >
                                {label}{' '}
                                {sortConfig?.key === key &&
                                    (sortConfig.direction === 'asc'
                                        ? '↑'
                                        : '↓')}
                            </TableHead>
                        ))}
                        <TableHead className="table-cell font-bold text-slate-50 text-end pr-4">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows()}</TableBody>
            </Table>
            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />
            <div className="max-w-[380px] flex items-center justify-between pl-2 gap-4 border-1 border-slate-200 rounded-xl w-full mx-auto mt-8">
                <Label
                    htmlFor="set-limit"
                    className="text-right text-slate-500 font-thin pl-3"
                >
                    Posts per page
                </Label>
                <Select
                    onValueChange={(value) => {
                        setQueryPramsLimit(Number(value))
                        setQueryPramsPage(1)
                    }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Select a limit" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem
                                key={i}
                                value={i.toString()}
                                className="border-1 focus:bg-slate-200 hover:bg-slate-300 dark:focus:bg-slate-500 dark:hover:bg-slate-600 cursor-pointer"
                            >
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
