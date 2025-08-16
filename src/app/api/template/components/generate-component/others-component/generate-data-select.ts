/**
 * Defines the structure for the schema object.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming convention object.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    [key: string]: string // Allows for additional keys
}

/**
 * Defines the structure for the main input JSON file.
 */
interface InputJsonFile {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

/**
 * Generates the content for the DataSelect.tsx component file.
 * Note: This component is static and does not depend on the input JSON.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object (not used in this function).
 * @returns {string} The complete DataSelect.tsx file content as a string.
 */
export const generateDataSelectComponentFile = (
    inputJsonFile: string
): string => {
    // The content of this component is static and reusable.
    // It does not need to be changed based on the schema or naming conventions.
    return `'use client'

import { useState, useEffect } from 'react'

import MultiSelect from './MultiSelect'

interface DataSelectProps {
    newItemTags: string[]
    setNewItemTags: (payload: string[]) => void
    label?: string
    placeholder?: string
}

export default function DataSelect({
    newItemTags,
    setNewItemTags,
    label = 'Select Tags',
    placeholder = 'Choose tags for your item',
}: DataSelectProps) {
    const [currentSelection, setCurrentSelection] =
        useState<string[]>(newItemTags)

    useEffect(() => {
        // This effect syncs the internal state with the parent's state
        // if the prop changes from the outside.
        if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
            setCurrentSelection(newItemTags)
        }
    }, [newItemTags, currentSelection])

    const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
        // This function handles changes from the MultiSelect component
        // and propagates them up to the parent component.
        if (
            JSON.stringify(newSelectionFromMultiSelect) !==
            JSON.stringify(currentSelection)
        ) {
            setCurrentSelection(newSelectionFromMultiSelect)
            setNewItemTags(newSelectionFromMultiSelect)
        } else {
            // Fallback for cases where object references differ but content is the same
            if (newSelectionFromMultiSelect !== currentSelection) {
                setCurrentSelection(newSelectionFromMultiSelect)
            }
        }
    }
    
    return (
        <div className="w-full">
            <form id="data-select-form" className="space-y-4">
                <MultiSelect
                    label={label}
                    placeholder={placeholder || 'Select options'}
                    defaultSelected={currentSelection}
                    onSelectionChange={handleSelectionChange}
                />
            </form>
        </div>
    )
}
`
}
