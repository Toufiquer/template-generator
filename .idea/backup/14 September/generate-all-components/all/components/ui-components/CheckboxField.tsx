// CheckboxField.tsx

'use client'

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Define a clear props interface for type safety and component API clarity
export interface CheckboxFieldProps {
    id: string
    // The checked state, controlled by the parent form
    checked: boolean
    // The callback to notify the parent when the state changes
    onCheckedChange: (checked: boolean) => void
    // The label content, can be a string or other React nodes
    label: React.ReactNode
    // Optional className for custom styling of the wrapper
    className?: string
}

export function CheckboxField({
    id,
    checked,
    onCheckedChange,
    label,
    className,
}: CheckboxFieldProps) {
    // This component is now fully controlled and stateless.
    // All props are passed directly to the underlying components.

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Checkbox
                id={id} // The id is now dynamic
                checked={checked} // The checked state is controlled by the parent
                onCheckedChange={onCheckedChange} // Notifies the parent of changes
            />
            {/* The Label is now correctly linked to the Checkbox via `htmlFor` */}
            <Label
                htmlFor={id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label} {/* The label text is now dynamic */}
            </Label>
        </div>
    )
}

CheckboxField.displayName = 'CheckboxField'
