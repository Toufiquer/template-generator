// DateRangePickerField.tsx

'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

// Define a clear and reusable props interface
export interface DateRangePickerProps {
    // The value should be a `DateRange` object or undefined
    value: DateRange | undefined
    // The callback to notify the parent of the new DateRange
    onChange: (range: DateRange | undefined) => void
    id: string
    label?: string
    placeholder?: string
    className?: string
}

export default function DateRangePickerField({
    id,
    label,
    value,
    onChange,
    placeholder = 'Select a date range',
    className,
}: DateRangePickerProps) {
    // State for managing the popover's visibility is perfectly fine.
    const [isOpen, setIsOpen] = React.useState(false)

    // The internal `date` state has been removed. The component is now fully controlled.

    return (
        <div className={cn('grid w-full items-center gap-1.5', className)}>
            {/* The label is now dynamic and correctly linked to the PopoverTrigger */}
            {label && <Label htmlFor={id}>{label}</Label>}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id} // Use the `id` prop
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {/* Display logic is now driven by the `value` prop */}
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, 'LLL dd, y')} -{' '}
                                    {format(value.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(value.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        // The selected range is controlled by the `value` prop
                        selected={value}
                        // When a new range is selected, call the parent's `onChange`
                        onSelect={(range) => {
                            onChange(range)
                            // Optionally, close the popover when a complete range is selected
                            if (range?.from && range?.to) {
                                setIsOpen(false)
                            }
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

DateRangePickerField.displayName = 'DateRangePickerField'
