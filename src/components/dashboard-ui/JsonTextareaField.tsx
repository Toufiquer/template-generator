/*
|-----------------------------------------
| setting up JsonTextareaField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, October, 2025
|-----------------------------------------
*/

'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface JsonTextareaFieldProps {
    id: string
    value: any // The value from the parent state (can be any object)
    onChange: (jsonValue: any) => void // Callback to update the parent state
}

const JsonTextareaField: React.FC<JsonTextareaFieldProps> = ({
    id,
    value,
    onChange,
}) => {
    // Internal state to hold the string representation of the JSON
    const [textValue, setTextValue] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    // Effect to sync the textarea when the parent's value prop changes
    // This is crucial for initializing the field or if the form is reset
    useEffect(() => {
        try {
            // Pretty-print the incoming object value
            const formattedJson = JSON.stringify(value, null, 2)
            setTextValue(formattedJson)
            setError(null)
        } catch (e) {
            setTextValue('Error formatting JSON')
            setError('The provided initial value is not a valid object.')
        }
    }, [value])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value
        setTextValue(newText)

        // Validate the JSON in real-time
        try {
            const parsedJson = JSON.parse(newText)
            setError(null)
            // If valid, call the parent's onChange with the parsed object
            onChange(parsedJson)
        } catch (err) {
            // If invalid, set an error and do not update the parent state
            setError('Invalid JSON format.')
        }
    }

    return (
        <div className="w-full">
            <Textarea
                id={id}
                value={textValue}
                onChange={handleTextChange}
                className={`w-full min-h-[150px] font-mono text-sm ${
                    error ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
                placeholder="Enter valid JSON here..."
            />
            {error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    )
}

export default JsonTextareaField
