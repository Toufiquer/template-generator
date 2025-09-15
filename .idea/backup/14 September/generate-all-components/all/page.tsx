'use client'

import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BiRightArrowAlt } from 'react-icons/bi'

import { Button } from '@/components/ui/button'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import AddFile from './components/Add'
import EditFile from './components/Edit'
import ViewFile from './components/View'
import SearchBox from './components/SearchBox'
import DeleteFile from './components/Delete'
import BulkEditFile from './components/BulkEdit'
import { useTest2sStore } from './store/store'
import TooManyRequests from './components/TooManyRequest'
import BulkDeleteFile from './components/BulkDelete'
import { useGetTest2sQuery } from './redux/rtk-api'
import ViewTest2sTable from './components/TableView'
import BulkUpdateTest2s from './components/BulkUpdate'
import BulkDynamicUpdateTest2s from './components/BulkDynamicUpdate'
import { handleSuccess } from './components/utils'
import { IoReloadCircleOutline } from 'react-icons/io5'

const MainNextPage: React.FC = () => {
    const [hashSearchText, setHashSearchText] = useState('')
    const {
        toggleAddModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        setQueryPramsPage,
        setQueryPramsQ,
    } = useTest2sStore()

    const {
        data: getResponseData,
        isSuccess,
        isLoading,
        refetch,
        status: statusCode,
    } = useGetTest2sQuery(
        { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
        {
            selectFromResult: ({ data, isSuccess,isLoading, status, error }) => ({
                data,
                isSuccess,
                isLoading,
                status:
                    'status' in (error || {})
                        ? (error as FetchBaseQueryError).status
                        : status, // Extract HTTP status code
                error,
            }),
        }
    )

    const handleSearch = (query: string) => {
        if (query !== hashSearchText) {
            setHashSearchText(query)
            setQueryPramsPage(1)
            setQueryPramsQ(query)
        }
    }

    const modals = [
        AddFile,
        ViewFile,
        BulkDeleteFile,
        BulkEditFile,
        EditFile,
        DeleteFile,
        BulkUpdateTest2s,
        BulkDynamicUpdateTest2s,
    ]
    const router = useRouter()

    let renderUI = (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
                <h1 className="h2 w-full">
                    Test2 Management{' '}
                    {isSuccess && (
                        <sup className="text-xs">
                            (total:{getResponseData?.data?.total || '00'})
                        </sup>
                    )}
                </h1>
                <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
                       <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            refetch()
                            handleSuccess('Reloaded!')
                        }}
                        disabled={isLoading}
                    >
                        <IoReloadCircleOutline className="w-4 h-4 mr-1" />{' '}
                        Reload
                    </Button>
                    <Button
                        size="sm"
                        variant="outlineGarden"
                        onClick={() => toggleAddModal(true)}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Test2
                    </Button>
                </div>
            </div>
            <SearchBox
                onSearch={handleSearch}
                placeholder="Search here ..."
                autoFocus={false}
            />
            <ViewTest2sTable />
            {modals.map((ModalComponent, index) => (
                <ModalComponent key={index} />
            ))}
        </div>
    )

    if (statusCode === 429) {
        renderUI = <TooManyRequests />
    }

    return renderUI
}

export default MainNextPage
