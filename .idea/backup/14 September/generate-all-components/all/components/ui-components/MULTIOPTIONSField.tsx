// MULTIOPTIONSField.tsx

'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { XIcon, PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define a clear props interface for the component
interface MULTIOPTIONSFieldProps {
    id?: string
    label?: string
    // value can now be undefined, which is safer for form state
    value: string[] | undefined
    onChange: (newValues: string[]) => void
    defaultOptions?: string[]
    placeholder?: string
    className?: string
}

export default function MULTIOPTIONSField({
    id,
    label,
    value,
    onChange,
    defaultOptions = ['Option 1', 'Option 2', 'Option 3'],
    placeholder = 'Search or add tags...',
    className,
}: MULTIOPTIONSFieldProps) {
    const [allData, setAllData] = useState<string[]>(() => {
        // Safely combine default options with the initial value
        const combined = new Set([...defaultOptions, ...(value ?? [])])
        return Array.from(combined)
    })

    const [inputValue, setInputValue] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // State to track the highlighted item for keyboard navigation
    const [activeIndex, setActiveIndex] = useState(-1)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filteredSuggestions = useMemo(() => {
        if (!inputValue) return []
        const lowerCaseInput = inputValue.toLowerCase()
        // Use a safe `value` by providing a fallback empty array
        const selectedValues = value ?? []
        return allData.filter(
            (item) =>
                !selectedValues.includes(item) &&
                item.toLowerCase().includes(lowerCaseInput)
        )
    }, [inputValue, allData, value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSelect = (item: string) => {
        // Use a safe `value` by providing a fallback empty array
        onChange([...(value ?? []), item])
        setInputValue('')
        setIsDropdownOpen(false)
        setActiveIndex(-1)
    }

    const handleRemove = (itemToRemove: string) => {
        onChange((value ?? []).filter((item) => item !== itemToRemove))
    }

    const handleAddNew = () => {
        const newItem = inputValue.trim()
        if (
            newItem &&
            !allData.some(
                (item) => item.toLowerCase() === newItem.toLowerCase()
            )
        ) {
            setAllData((prev) => [...prev, newItem])
            handleSelect(newItem)
        }
    }

    // --- NEW: Keyboard Navigation Handler ---
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isDropdownOpen) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setActiveIndex((prev) =>
                    Math.min(prev + 1, filteredSuggestions.length - 1)
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setActiveIndex((prev) => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
                    handleSelect(filteredSuggestions[activeIndex])
                } else if (inputValue.trim()) {
                    handleAddNew()
                }
                break
            case 'Escape':
                setIsDropdownOpen(false)
                setActiveIndex(-1)
                break
        }
    }

    return (
        <div
            className={cn('grid w-full max-w-lg gap-1.5', className)}
            ref={wrapperRef}
        >
            {label && <Label htmlFor={id}>{label}</Label>}
            <div className="flex flex-wrap items-center gap-2 p-1.5 border rounded-md bg-background min-h-[46px]">
                {(value ?? []).map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-sm"
                    >
                        <span>{item}</span>
                        <button
                            onClick={() => handleRemove(item)}
                            className="rounded-full hover:bg-muted-foreground/20 transition-colors"
                            aria-label={`Remove ${item}`}
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <Input
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        setIsDropdownOpen(true)
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={(value ?? []).length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] border-none focus:ring-0 shadow-none p-1"
                />
            </div>

            {isDropdownOpen &&
                (filteredSuggestions.length > 0 || inputValue.trim()) && (
                    <div className="absolute z-10 w-full mt-2 bg-card border rounded-md shadow-lg animate-in fade-in-0 zoom-in-95">
                        <ul className="py-1 max-h-60 overflow-y-auto">
                            {filteredSuggestions.map((item, index) => (
                                <li
                                    key={item}
                                    onClick={() => handleSelect(item)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={cn(
                                        'px-3 py-2 text-sm cursor-pointer hover:bg-accent',
                                        { 'bg-accent': index === activeIndex }
                                    )}
                                >
                                    {item}
                                </li>
                            ))}
                            {inputValue.trim() && (
                                <li className="px-3 py-2 text-sm">
                                    <button
                                        onClick={handleAddNew}
                                        className="flex items-center justify-between w-full text-left text-primary hover:font-semibold transition-all"
                                    >
                                        <span>
                                            Add &quot;{inputValue}&quot;
                                        </span>
                                        <PlusCircleIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
        </div>
    )
}
