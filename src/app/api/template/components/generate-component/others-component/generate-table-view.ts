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
    [key: string]: string
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
 * Generates the content for a dynamic ViewTable.tsx component file.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete ViewTable.tsx file content as a string.
 */
export const generateViewTableComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___
    const singularPascalCase = namingConvention.User_3_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const interfaceName = `I${pluralPascalCase}`

    // 1. Dynamically determine which fields are suitable for table columns.
    const suitableTypes = [
        'STRING',
        'EMAIL',
        'SELECT',
        'RADIOBUTTON',
        'INTNUMBER',
        'FLOATNUMBER',
        'BOOLEAN',
        'CHECKBOX',
        'DATE',
        'TIME',
    ]
    const excludedKeys = [
        'password',
        'passcode',
        'description',
        'richtext',
        'image',
        'images',
    ]
    const tableHeaders = Object.entries(schema)
        .filter(
            ([key, type]) =>
                typeof type === 'string' &&
                !key.includes('-') && // Exclude keys with hyphens that are harder to sort
                suitableTypes.includes(type.toUpperCase()) &&
                !excludedKeys.includes(key.toLowerCase())
        )
        .slice(0, 7) // Limit to a reasonable number of columns
        .map(([key]) => ({
            key: key,
            label: key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase()), // Format label
        }))
    tableHeaders.push({ key: 'createdAt', label: 'Created At' })

    // 2. Generate the JSX for the table cells in each row.
    const renderTableCellsJsx = tableHeaders
        .map(({ key }) => {
            const type = schema[key] as string
            if (
                type &&
                (type.toUpperCase() === 'BOOLEAN' ||
                    type.toUpperCase() === 'CHECKBOX')
            ) {
                return `<TableCell>
                    <span className={\`px-2 py-1 rounded-full text-xs font-medium \${item['${key}'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                        {item['${key}'] ? 'Yes' : 'No'}
                    </span>
                </TableCell>`
            }
            if (
                key === 'createdAt' ||
                (type && type.toUpperCase() === 'DATE')
            ) {
                return `<TableCell>{formatDate(item['${key}'])}</TableCell>`
            }
            return `<TableCell>{(item as any)['${key}']}</TableCell>`
        })
        .join('\n                ')

    // 3. Construct the entire component string.
    return `'use client'

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

import { ${interfaceName} } from '../api/v1/model'
import { pageLimitArr } from '../store/store-constant'
import { use${pluralPascalCase}Store } from '../store/store'
import { useGet${pluralPascalCase}Query } from '../redux/rtk-api'
import Pagination from './Pagination'
import { handleSuccess } from './utils'

const ViewTableNextComponents: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof ${interfaceName}
        direction: 'asc' | 'desc'
    } | null>(null)
    
    const {
        setSelected${pluralPascalCase},
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
    } = use${pluralPascalCase}Store()

    const {
        data: getResponseData,
        isLoading,
        refetch,
        isError,
        error,
    } = useGet${pluralPascalCase}Query({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.${pluralLowerCase} || [],
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

    const handleSort = (key: keyof ${interfaceName}) => {
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

    const handleSelectRow = (isChecked: boolean, item: ${interfaceName}) =>
        setBulkData(
            isChecked
                ? [...bulkData, item]
                : bulkData.filter((i) => i._id !== item._id)
        )

    const tableHeaders: { key: keyof ${interfaceName}; label: string }[] = [
        ${tableHeaders.map((h) => `{ key: '${h.key}', label: '${h.label}' }`).join(',\n        ')}
    ];

    const renderActions = (item: ${interfaceName}) => (
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleViewModal(true); }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleEditModal(true); }}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleDeleteModal(true); }}>
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    )

    const renderTableRows = () =>
        sortedData.map((item: ${interfaceName}) => (
            <TableRow key={item._id}>
                <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(!!checked, item)}
                        checked={bulkData.some((i) => i._id === item._id)}
                    />
                </TableCell>
                ${renderTableCellsJsx}
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
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={bulkData.length === allData.length && allData.length > 0}
                                />
                            </TableHead>
                            {tableHeaders.map(({ key, label }) => (
                                <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key as keyof ${interfaceName})}>
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
                    ${pluralPascalCase} per page
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
`
}
