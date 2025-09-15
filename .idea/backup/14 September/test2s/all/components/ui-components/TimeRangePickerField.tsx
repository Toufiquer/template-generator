// TimeRangePickerField.tsx

'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Define a clear props interface with a proper data structure for the range
export interface TimeRangePickerProps {
    // The value should be an object representing the start and end times
    value: { start: string; end: string } | undefined
    // The callback to notify the parent of the updated range object
    onChange: (range: { start: string; end: string } | undefined) => void
    id: string
    label?: string
    className?: string
}

export default function TimeRangePickerField({
    id,
    label = 'Time Range', // Provide a default label
    value,
    onChange,
    className,
}: TimeRangePickerProps) {
    // The component is now stateless. All internal useState calls have been removed.

    // A single, robust handler to update either the start or end time.
    const handleTimeChange = (part: 'start' | 'end', timeValue: string) => {
        // Create a new range object based on the current value, providing defaults if none exists
        const newRange = {
            start: value?.start ?? '00:00',
            end: value?.end ?? '00:00',
        }

        // Update either the 'start' or 'end' property
        newRange[part] = timeValue

        // Notify the parent component with the complete, updated range object
        onChange(newRange)
    }

    return (
        <div className={cn('grid w-full items-center gap-1.5', className)}>
            {/* The Label is now dynamic and properly associated with the first input */}
            <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <Label htmlFor={id}>{label}</Label>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    id={id} // The main id is on the start time input
                    type="time"
                    // The value is controlled by the parent's state
                    value={value?.start ?? ''}
                    // The onChange handler reports changes back to the parent
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full"
                    aria-label="Start time"
                />
                <span className="text-gray-500">-</span>
                <Input
                    type="time"
                    // The value is controlled by the parent's state
                    value={value?.end ?? ''}
                    // The onChange handler reports changes back to the parent
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full"
                    aria-label="End time"
                />
            </div>
        </div>
    )
}

TimeRangePickerField.displayName = 'TimeRangePickerField'
