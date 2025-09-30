'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus, Search } from 'lucide-react'

const MultiOptionsField = () => {
    // State to manage all available data options
    const [allData, setAllData] = useState<string[]>([
        'Apple',
        'Banana',
        'Cherry',
        'Date',
        'Elderberry',
        'Fig',
        'Grape',
        'Honeydew',
    ])

    // State to manage the currently selected data
    const [selectedData, setSelectedData] = useState<string[]>([])

    // State for the search input value
    const [searchValue, setSearchValue] = useState('')

    // State to control the visibility of the options dropdown
    const [isOpen, setIsOpen] = useState(false)

    // Ref to the main component wrapper for detecting outside clicks
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Effect to handle clicks outside the component to close the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    // Filter data based on search input and exclude already selected items
    const filteredData = allData.filter(
        (item) =>
            item.toLowerCase().includes(searchValue.toLowerCase()) &&
            !selectedData.includes(item)
    )

    // Handle selection of an item from the dropdown
    const handleSelect = (item: string) => {
        setSelectedData([...selectedData, item])
        setSearchValue('')
        setIsOpen(false)
    }

    // Handle removal of a selected item
    const handleRemove = (itemToRemove: string) => {
        setSelectedData(selectedData.filter((item) => item !== itemToRemove))
    }

    // Handle adding a new item that doesn't exist in allData
    const handleAddNew = () => {
        if (searchValue && !allData.includes(searchValue)) {
            setAllData([...allData, searchValue])
            setSelectedData([...selectedData, searchValue])
            setSearchValue('')
            setIsOpen(false)
        }
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-lg">
            {/* Main input container with glassy effect */}
            <div className="relative backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl hover:shadow-xl transition-all duration-300">
                {/* Glassy overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl pointer-events-none"></div>

                {/* Selected items display */}
                {selectedData.length > 0 && (
                    <div className="relative flex flex-wrap gap-2 mb-3 min-h-[40px] items-center">
                        {selectedData.map((item, index) => (
                            <div
                                key={item}
                                className="group animate-in fade-in slide-in-from-left-2 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-full border border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                    <span className="drop-shadow-sm">
                                        {item}
                                    </span>
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="ml-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-accent/30 rounded-full p-0.5 transition-all duration-200 hover:rotate-90"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search input with icon */}
                <div className="flex-grow flex items-center relative min-w-[200px]">
                    <Search
                        size={18}
                        className="absolute left-2 text-muted-foreground z-10"
                    />
                    <Input
                        placeholder={
                            selectedData.length === 0
                                ? 'Search or add items...'
                                : 'Add more...'
                        }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder-muted-foreground pl-8 text-base font-medium"
                    />
                </div>
            </div>

            {/* Dropdown with glassy effect */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="backdrop-blur-xl bg-popover/90 border border-border rounded-xl shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none"></div>

                        <ul className="relative max-h-64 overflow-y-auto">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <li
                                        key={item}
                                        onClick={() => handleSelect(item)}
                                        className="px-4 py-3 cursor-pointer text-popover-foreground hover:bg-accent transition-all duration-200 border-b border-border/50 last:border-b-0 hover:shadow-lg backdrop-blur-sm hover:pl-6"
                                        style={{
                                            animationDelay: `${index * 30}ms`,
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-primary rounded-full mr-3 opacity-60"></div>
                                            <span className="font-medium drop-shadow-sm">
                                                {item}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-4 centralized-between text-popover-foreground">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                                        <span className="font-medium">
                                            No options found
                                        </span>
                                    </div>
                                    {searchValue && (
                                        <Button
                                            onClick={handleAddNew}
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                                        >
                                            <Plus size={14} className="mr-1" />
                                            Add &ldquo;{searchValue}&ldquo;
                                        </Button>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
        </div>
    )
}

export default MultiOptionsField
