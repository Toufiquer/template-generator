export const generateViewTableComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = namingConvention.users_2_000___
    const interfaceName = `I${pluralPascalCase}`
    const displayableKeysTypeName = `Displayable${pluralPascalCase}Keys`
    const isUsedGenerateFolder = namingConvention.use_generate_folder

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `../redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }

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
                !key.includes('-') &&
                suitableTypes.includes(type.toUpperCase()) &&
                !excludedKeys.includes(key.toLowerCase())
        )
        .slice(0, 7)
        .map(([key]) => ({
            key: key,
            label: key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase()),
        }))
    tableHeaders.push({ key: 'createdAt', label: 'Created At' })

    const displayableKeysType = `type ${displayableKeysTypeName} = \n    | '${tableHeaders
        .map((h) => h.key)
        .join("'\n    | '")}'`

    const columnVisibilityStateType = `type ColumnVisibilityState = Record<${displayableKeysTypeName}, boolean>`

    return `'use client'

import { format } from 'date-fns'
import React, { useState, useMemo } from 'react'
import {
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DownloadIcon,
} from 'lucide-react'

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { ${interfaceName} } from '../store/data/data'
import { pageLimitArr } from '../store/store-constant'
import { use${pluralPascalCase}Store } from '../store/store'
import { useGet${pluralPascalCase}Query } from '${reduxPath}'
import Pagination from './Pagination'
import ExportDialog from './ExportDialog'

${displayableKeysType}
${columnVisibilityStateType}

const ViewTableNextComponents: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: ${displayableKeysTypeName}; direction: 'asc' | 'desc' } | null>(null)
  const [isExportDialogOpen, setExportDialogOpen] = useState(false)

  const {
    setSelected${pluralPascalCase},
    toggleBulkEditModal,
    toggleBulkUpdateModal,
    toggleViewModal,
    queryPramsLimit,
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

  const { data: getResponseData, isLoading, isError, error } = useGet${pluralPascalCase}Query({
    q: queryPramsQ,
    limit: queryPramsLimit,
    page: queryPramsPage,
  })

  const allData = useMemo(() => getResponseData?.data?.${pluralLowerCase} || [], [getResponseData])

  const tableHeaders: { key: ${displayableKeysTypeName}; label: string }[] = [
    ${tableHeaders.map((h) => `{ key: '${h.key}', label: '${h.label}' }`).join(',\n    ')}
  ]

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const state = {} as ColumnVisibilityState
    tableHeaders.forEach(h => state[h.key] = true)
    return state
  })

  const visibleHeaders = useMemo(() => tableHeaders.filter(h => columnVisibility[h.key]), [columnVisibility, tableHeaders])

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A'
    try { return format(new Date(date), 'MMM dd, yyyy') } catch { return 'Invalid Date' }
  }

  const handleSort = (key: ${displayableKeysTypeName}) => {
    setSortConfig(prev => prev?.key === key
      ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: 'asc' })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return allData
    return [...allData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue == null) return 1
      if (bValue == null) return -1
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [allData, sortConfig])

  const handleSelectAll = (checked: boolean) => setBulkData(checked ? allData : [])
  const handleSelectRow = (checked: boolean, item: ${interfaceName}) =>
    setBulkData(checked ? [...bulkData, item] : bulkData.filter(i => i._id !== item._id))

  const renderActions = (item: ${interfaceName}) => (
    <div className="flex justify-end items-center">
      {/* Desktop actions */}
      <div className="hidden md:flex gap-2">
        <Button variant="outlineWater" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleViewModal(true) }} className="min-w-1">
          <EyeIcon className="w-4 h-4" />
        </Button>
        <Button variant="outlineWater" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleEditModal(true) }} className="min-w-1">
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => { setSelected${pluralPascalCase}(item); toggleDeleteModal(true) }} className="min-w-1">
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile actions (Sheet) */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outlineWater" size="icon" className="rounded-full border-none min-w-[8px]">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full backdrop-blur-xl bg-white/10 border-t border-white/20 text-white rounded-t-2xl p-4 space-y-3">
            <SheetHeader><SheetTitle className="text-center text-white/90">Actions</SheetTitle></SheetHeader>
            <Button variant="outlineWater" onClick={() => { setSelected${pluralPascalCase}(item); toggleViewModal(true); setOpen(false) }}>
              <EyeIcon className="w-4 h-4 mr-2" /> View
            </Button>
            <Button variant="outlineWater" onClick={() => { setSelected${pluralPascalCase}(item); toggleEditModal(true); setOpen(false) }}>
              <PencilIcon className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => { setSelected${pluralPascalCase}(item); toggleDeleteModal(true); setOpen(false) }}>
              <TrashIcon className="w-4 h-4 mr-2" /> Delete
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )

  if (isLoading) return <LoadingComponent />
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />

  return (
    <div className="w-full flex flex-col">
      {/* Toolbar */}
      <div className="w-full my-4">
        <div className="w-full flex md:flex-row flex-col items-center justify-between gap-4 pb-2 border-b border-white/20">
          <div className="flex items-center gap-2 w-full text-white/80">
            <Label>Selected:</Label><span className="text-sm">({bulkData.length})</span>
          </div>

          {/* Desktop Toolbar */}
          <div className="hidden md:flex items-center gap-2 justify-end w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineWater" size="sm">
                  <MoreHorizontalIcon className="w-4 h-4 mr-2" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tableHeaders.map(h => (
                  <DropdownMenuCheckboxItem key={h.key} checked={columnVisibility[h.key]} onCheckedChange={v => setColumnVisibility(prev => ({ ...prev, [h.key]: !!v }))}>
                    {h.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={!bulkData.length}>
              <DownloadIcon className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={!bulkData.length}>
              <PencilIcon className="w-4 h-4 mr-2" /> B.Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={!bulkData.length}>
              <TrashIcon className="w-4 h-4 mr-2" /> B.Delete
            </Button>
          </div>

          {/* Mobile Toolbar */}
          <div className="flex md:hidden justify-end w-full">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outlineWater" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 min-w-[8px]">
                  <MoreHorizontalIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={cn('w-72 bg-white/10 backdrop-blur-xl text-white p-4 rounded-l-2xl space-y-4 border border-white/20')}
              >
                <SheetHeader><SheetTitle className="text-white/90">Toolbar</SheetTitle></SheetHeader>

                {/* ✅ Correct Dropdown block inserted here */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outlineWater" size="sm" className="justify-start">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tableHeaders.map(header => (
                      <DropdownMenuCheckboxItem
                        key={header.key}
                        className="capitalize"
                        checked={columnVisibility[header.key]}
                        onCheckedChange={value =>
                          setColumnVisibility(prev => ({
                            ...prev,
                            [header.key]: !!value,
                          }))
                        }
                      >
                        {header.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={!bulkData.length}>
                  <DownloadIcon className="w-4 h-4 mr-1" /> Export
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={!bulkData.length}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={!bulkData.length}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={!bulkData.length}>
                  <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Responsive Table */}
      {allData.length === 0 ? (
        <div className="py-12 text-center text-2xl text-white/70">Ops! Nothing was found.</div>
      ) : (
        <div className="w-full">
          {/* Mobile Scroll */}
          <div className="block md:hidden">
            <ScrollArea className="w-[420px] sm:w-[760px] md:w-full rounded-md border border-white/10 bg-white/5 backdrop-blur-md whitespace-nowrap">
              <div className="flex w-max">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-300/40 text-white font-semibold">
                      <TableHead>
                        <Checkbox onCheckedChange={(v) => handleSelectAll(!!v)} checked={bulkData.length === allData.length && allData.length > 0} />
                      </TableHead>
                      {visibleHeaders.map(({ key, label }) => (
                        <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                          {label}
                          {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((item: ${interfaceName}) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Checkbox onCheckedChange={(v) => handleSelectRow(!!v, item)} checked={bulkData.some((i) => i._id === item._id)} />
                        </TableCell>
                        {visibleHeaders.map(header => (
                          <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
                        ))}
                        <TableCell className="text-right">{renderActions(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-300/40 text-white font-semibold">
                  <TableHead>
                    <Checkbox onCheckedChange={(v) => handleSelectAll(!!v)} checked={bulkData.length === allData.length && allData.length > 0} />
                  </TableHead>
                  {visibleHeaders.map(({ key, label }) => (
                    <TableHead key={key} className="cursor-pointer" onClick={() => handleSort(key)}>
                      {label}
                      {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item: ${interfaceName}) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Checkbox onCheckedChange={(v) => handleSelectRow(!!v, item)} checked={bulkData.some((i) => i._id === item._id)} />
                    </TableCell>
                    {visibleHeaders.map(header => (
                      <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
                    ))}
                    <TableCell className="text-right">{renderActions(item)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={setQueryPramsPage}
        totalItems={getResponseData?.data?.total || 0}
      />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-slate-300 font-normal pl-3">
          ${pluralPascalCase} per page
        </Label>
        <Select
          onValueChange={(v) => { setQueryPramsLimit(Number(v)); setQueryPramsPage(1); }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="border-0 bg-transparent text-white">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setExportDialogOpen}
        headers={tableHeaders}
        data={bulkData}
        fileName={\`Exported_${pluralPascalCase}_\${new Date().toISOString()}.xlsx\`}
      />
    </div>
  )
}

export default ViewTableNextComponents
`
}
