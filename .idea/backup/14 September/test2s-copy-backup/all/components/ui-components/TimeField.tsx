// TimeField.tsx

'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { format } from 'date-fns' // Using a reliable library for date/time formatting

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

// Define a clear, reusable props interface
export interface TimeFieldProps {
    // The value should be a string in "HH:mm" (24-hour) format for data consistency
    value: string | null | undefined
    // The callback to notify the parent of the new "HH:mm" time string
    onChange: (time: string | undefined) => void
    id: string
    label?: string
    placeholder?: string
    className?: string
}

export default function TimeField({
    id,
    label,
    value,
    onChange,
    placeholder = 'Pick a time',
    className,
}: TimeFieldProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const hourScrollRef = React.useRef<HTMLDivElement>(null)
    const minuteScrollRef = React.useRef<HTMLDivElement>(null)

    // Memoize parsing the time string to avoid re-calculating on every render
    const parsedTime = React.useMemo(() => {
        if (!value) return { hour: null, minute: null }
        const [h, m] = value.split(':').map(Number)
        if (!isNaN(h) && h >= 0 && h <= 23 && !isNaN(m) && m >= 0 && m <= 59) {
            return { hour: h, minute: m }
        }
        return { hour: null, minute: null }
    }, [value])

    // Format the "HH:mm" string for user-friendly display (e.g., "02:30 PM")
    const displayTime = React.useMemo(() => {
        if (parsedTime.hour === null || parsedTime.minute === null) {
            return placeholder
        }
        const date = new Date()
        date.setHours(parsedTime.hour, parsedTime.minute)
        return format(date, 'hh:mm a') // e.g., 02:30 PM
    }, [parsedTime, placeholder])

    // A single handler to update the time
    const handleTimeChange = (part: 'hour' | 'minute', val: number) => {
        // Use the current time as a fallback if nothing is selected yet
        const now = new Date()
        const currentHour = parsedTime.hour ?? now.getHours()
        const currentMinute = parsedTime.minute ?? now.getMinutes()

        const newHour = part === 'hour' ? val : currentHour
        const newMinute = part === 'minute' ? val : currentMinute

        // Format to "HH:mm" and notify the parent
        const newTimeString = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`
        onChange(newTimeString)

        // If they've selected a minute, we can assume they're done and close the popover
        if (part === 'minute') {
            setIsOpen(false)
        }
    }

    // Scroll to the selected time when the popover opens
    React.useEffect(() => {
        if (isOpen && parsedTime.hour !== null) {
            hourScrollRef.current
                ?.querySelector(`[data-hour="${parsedTime.hour}"]`)
                ?.scrollIntoView({ block: 'center' })
        }
        if (isOpen && parsedTime.minute !== null) {
            minuteScrollRef.current
                ?.querySelector(`[data-minute="${parsedTime.minute}"]`)
                ?.scrollIntoView({ block: 'center' })
        }
    }, [isOpen, parsedTime])

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    return (
        <div className={cn('grid w-full items-center gap-1.5', className)}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        {displayTime}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                    <div className="flex max-h-52">
                        <ScrollArea
                            className="h-52 w-24 border-r"
                            ref={hourScrollRef}
                        >
                            <div className="p-1">
                                {hours.map((hour) => (
                                    <Button
                                        key={hour}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-center text-sm p-2',
                                            parsedTime.hour === hour &&
                                                'bg-accent'
                                        )}
                                        onClick={() =>
                                            handleTimeChange('hour', hour)
                                        }
                                        data-hour={hour}
                                    >
                                        {format(
                                            new Date().setHours(hour),
                                            'hh a'
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                        <ScrollArea className="h-52 w-20" ref={minuteScrollRef}>
                            <div className="p-1">
                                {minutes.map((minute) => (
                                    <Button
                                        key={minute}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-center text-sm p-2',
                                            parsedTime.minute === minute &&
                                                'bg-accent'
                                        )}
                                        onClick={() =>
                                            handleTimeChange('minute', minute)
                                        }
                                        data-minute={minute}
                                    >
                                        {String(minute).padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
