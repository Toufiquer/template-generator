/**
 * Defines the structure for the schema object.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming convention object.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    [key: string]: string // Allows for additional keys
}

/**
 * Defines the structure for the main input JSON file.
 */
interface InputJsonFile {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

/**
 * Generates the content for the main client-side management page (page.tsx).
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateMainPageFile = (inputJsonFile: string): string => {
    const { namingConvention } = JSON.parse(inputJsonFile) || {}

    // Extract names and format them for different uses
    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const singularLowerCase = namingConvention.user_4_000___ // e.g., "post"

    // Construct the file content using a template literal
    return `'use client'

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
import { use${pluralPascalCase}Store } from './store/store'
import TooManyRequests from './components/TooManyRequest'
import BulkDeleteFile from './components/BulkDelete'
import { useGet${pluralPascalCase}Query } from './redux/rtk-api'
import View${pluralPascalCase}Table from './components/TableView'
import BulkUpdate${pluralPascalCase} from './components/BulkUpdate'
import BulkDynamicUpdate${pluralPascalCase} from './components/BulkDynamicUpdate'

const MainNextPage: React.FC = () => {
    const [hashSearchText, setHashSearchText] = useState('')
    const {
        toggleAddModal,
        queryPramsLimit,
        queryPramsPage,
        queryPramsQ,
        setQueryPramsPage,
        setQueryPramsQ,
    } = use${pluralPascalCase}Store()

    const {
        data: getResponseData,
        isSuccess,
        status: statusCode,
    } = useGet${pluralPascalCase}Query(
        { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
        {
            selectFromResult: ({ data, isSuccess, status, error }) => ({
                data,
                isSuccess,
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
        BulkUpdate${pluralPascalCase},
        BulkDynamicUpdate${pluralPascalCase},
    ]
    const router = useRouter()

    let renderUI = (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
                <h1 className="h2 w-full">
                    ${singularPascalCase} Management{' '}
                    {isSuccess && (
                        <sup className="text-xs">
                            (total:{getResponseData?.data?.total || '00'})
                        </sup>
                    )}
                </h1>
                <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
                    <Button
                        size="sm"
                        variant="outlineGarden"
                        onClick={() =>
                            router.push('/dashboard/${singularLowerCase}/ssr-view')
                        }
                    >
                        <BiRightArrowAlt className="w-4 h-4" />
                        SSR View
                    </Button>
                    <Button
                        size="sm"
                        variant="outlineGarden"
                        onClick={() =>
                            router.push('/dashboard/${singularLowerCase}/client-view')
                        }
                    >
                        <BiRightArrowAlt className="w-4 h-4" />
                        Client View
                    </Button>
                    <Button
                        size="sm"
                        variant="outlineGarden"
                        onClick={() => toggleAddModal(true)}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add ${singularPascalCase}
                    </Button>
                </div>
            </div>
            <SearchBox
                onSearch={handleSearch}
                placeholder="Search here ..."
                autoFocus={false}
            />
            <View${pluralPascalCase}Table />
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
`
}
