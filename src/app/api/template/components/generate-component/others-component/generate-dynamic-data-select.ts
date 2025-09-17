/**
 * Generates the content for the DynamicDataSelect.tsx component file.
 * Note: This component is static and does not depend on the input JSON.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object (not used in this function).
 * @returns {string} The complete DynamicDataSelect.tsx file content as a string.
 */
export const generateDynamicDataSelectComponentFile = (
    inputJsonFile: string
): string => {
    // The content of this component is static and reusable.
    // It does not need to be changed based on the schema or naming conventions.
    console.log('inputJsonFile', inputJsonFile)
    return `'use client'

import { useState, useEffect } from 'react'

import MultiSelect from './MultiSelect'

interface DataSelectProps {
    newItemTags: string[]
    setNewItemTags: (payload: string[]) => void
    label?: string
    placeholder?: string
}

export default function DynamicDataSelect({
    newItemTags,
    setNewItemTags,
    label,
    placeholder,
}: DataSelectProps) {
    const [currentSelection, setCurrentSelection] =
        useState<string[]>(newItemTags)

    useEffect(() => {
        // Syncs the internal state with the parent's state if the prop changes.
        if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
            setCurrentSelection(newItemTags)
        }
    }, [newItemTags, currentSelection])

    const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
        // Handles changes from the MultiSelect component and passes them up to the parent.
        if (
            JSON.stringify(newSelectionFromMultiSelect) !==
            JSON.stringify(currentSelection)
        ) {
            setCurrentSelection(newSelectionFromMultiSelect)
            setNewItemTags(newSelectionFromMultiSelect)
        }
    }

    return (
        <div className="w-full">
            <form id="dynamic-data-select-form" className="space-y-4">
                <MultiSelect
                    label={label}
                    placeholder={placeholder || 'Select options...'}
                    defaultSelected={currentSelection}
                    onSelectionChange={handleSelectionChange}
                />
            </form>
        </div>
    )
}
`
}
