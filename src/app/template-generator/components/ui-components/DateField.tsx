/*
|-----------------------------------------
| setting up DateField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/

/*
|-----------------------------------------
| setting up DateField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/
'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

export function DateField() {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    // Add a useEffect to log changes in date for debugging
    React.useEffect(() => {
        console.log(
            'Current selected date:',
            date ? date.toLocaleDateString() : 'No date selected'
        )
    }, [date])

    return (
        <div className="flex flex-col gap-3">
            <div className="text-red-700">
                This component works without popup
            </div>
            <Label htmlFor="date-field" className="px-1">
                Date of birth
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-field"
                        className="w-48 justify-between font-normal"
                    >
                        {date ? format(date, 'PPP') : 'Select date'}
                        <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        fromYear={1900} // Added required prop for dropdown layout
                        toYear={new Date().getFullYear()} // Current year as upper bound
                        onSelect={(selectedDate) => {
                            console.log(
                                'Date selected in calendar:',
                                selectedDate
                            )
                            setDate(selectedDate)
                            setOpen(false)
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
