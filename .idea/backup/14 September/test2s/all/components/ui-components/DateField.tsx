// DateField.tsx

'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react' // Use a more standard icon

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

// Define a more consistent and flexible props interface
export interface DateFieldProps {
    // Use `value` for consistency with standard form inputs
    value: Date | null | undefined
    // Use `onChange` for consistency. It can receive `undefined` when a date is cleared.
    onChange: (date: Date | undefined) => void
    id: string
    label?: string
    placeholder?: string
    className?: string
}

export function DateField({
    id,
    label,
    value,
    onChange,
    placeholder = 'Pick a date',
    className,
}: DateFieldProps) {
    // This state is for controlling the popover's visibility only, which is fine.
    const [open, setOpen] = React.useState(false)

    // The component is now "dumb" and relies entirely on props for its date value.
    // The internal `date` and `setDate` state has been removed.

    return (
        <div className={cn('grid w-full items-center gap-1.5', className)}>
            {/* The label is now dynamic and correctly linked to the input via `id` */}
            {label && <Label htmlFor={id}>{label}</Label>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        id={id} // Use the `id` prop here
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {/* The button's text is now driven by the `value` prop */}
                        {value ? (
                            format(value, 'PPP')
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        // The selected date is controlled by the `value` prop
                        selected={value ?? undefined}
                        // When a date is selected, call the parent's `onChange` and close the popover
                        onSelect={(selectedDate) => {
                            onChange(selectedDate)
                            setOpen(false)
                        }}
                        captionLayout="dropdown" // A more modern layout
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

DateField.displayName = 'DateField'
