// components/JsonEditor.tsx
'use client'

import React, { useState } from 'react'
import { useJsonStore } from '@/lib/store/jsonStore'
import JsonEditorSingleItem from './JsonEditorSingleItem'

import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import ViewDataType from './ViewDataType'

const JsonEditor: React.FC = () => {
    const [jsonInput, setJsonInput] = useState<string>(
        '{\n  "uid": "000",\n  "templateName": "Basic Template",\n  "schema": {\n    "title": "STRING",\n    "email": "EMAIL", \n    "password": "PASSWORD",\n    "passcode": "PASSCODE",\n    "area": "SELECT",\n    "books-list": "MULTISELECT",\n    "check-list": "MULTIDYNAMICSELECT",\n    "sub-area": "DYNAMICSELECT",\n    "products-images": "IMAGES",\n    "personal-image": "IMAGE",\n    "description": "DESCRIPTION",\n    "age": "INTNUMBER",\n    "amount": "FLOATNUMBER",\n    "isActive": "BOOLEAN",\n    "start-date": "DATE",\n    "start-time": "TIME",\n    "schedule-date": "DATERANGE",\n    "schedule-time": "TIMERANGE",\n    "favorite-color": "COLORPICKER",\n    "number": "PHONE",\n    "profile": "URL",\n    "test": "RICHTEXT",\n    "info": "AUTOCOMPLETE",\n    "shift": "RADIOBUTTON",\n    "policy": "CHECKBOX",\n    "hobbys": "MULTICHECKBOX"\n  },\n  "namingConvention": {\n    "Users_1_000___": "Posts",\n    "users_2_000___": "posts",\n    "User_3_000___": "Post",\n    "user_4_000___": "post",\n    "ISelect_6_000___": "ISelect",\n    "select_5_000___": "select"\n  }\n}'
    )
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { items, addItem, removeItem, clearItems } = useJsonStore()

    console.log('items : ', items)
    const handleSave = async () => {
        setError('')
        setIsLoading(true)

        try {
            // Validate JSON
            const parsedJson = JSON.parse(jsonInput)

            const isAlreadyExist = items.find(
                (i) => i.data.uid === parsedJson.uid
            )
            if (isAlreadyExist?.id) {
                setError('Json already exist with this uid.')
                return
            } else {
                // Add to Zustand store
                addItem(parsedJson)
                setJsonInput('')
            }
        } catch (err) {
            setError('Invalid JSON format. Please check your syntax.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonInput(e.target.value)
        // Clear error when user starts typing
        if (error) setError('')
    }

    const handleGenerate = () => {}
    const handleFormat = () => {
        console.log('json : ', jsonInput)
    }
    const handleGenerate = async () => {
        console.log('handle generate is start')

        setError('')
        setIsLoading(true)
        try {
            const response = await fetch('/api/template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: jsonInput }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const result = await response.json()
            console.log('Success:', result)
            // Handle success response
        } catch (error) {
            setError('Failed to fetch: ' + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
        console.log('handle generate is End')
    }

    return (
        <div className="w-full mx-auto p-6">
            <div className=" rounded-lg shadow-md p-6">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray- 800 dark:text-gray-00 mb-4">
                        JSON Editor
                    </h2>
                    <ViewDataType />
                </div>

                {/* JSON Input Form */}
                <div className="space-y-4">
                    <label
                        htmlFor="json-input"
                        className="block text-sm font-medium text-gray-500"
                    >
                        JSON Input
                    </label>
                    <textarea
                        id="json-input"
                        value={jsonInput}
                        onChange={handleInputChange}
                        className="w-full dark:text-gray-100 h-64 p-4 min-w-7xl border dark:bg-gray-900 border-gray-300 rounded-md font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your JSON data here..."
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm  p-3 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading || !jsonInput.trim()}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            onClick={handleFormat}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Formet
                        </Button>
                        <Button
                            disabled={isLoading || !jsonInput.trim()}
                            onClick={handleGenerate}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Saved Items Display */}
            <div className=" rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-600">
                        Saved Items ({items.length})
                    </h3>
                    {items.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger className="px-4 py-2 cursor-pointer bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                                Clear All
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction className="px-4 py-2 cursor-pointer bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                                        <button onClick={clearItems}>
                                            Clear All
                                        </button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No items saved yet. Add some JSON data above!
                    </p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {items.map((item) => (
                            <JsonEditorSingleItem
                                key={item.id}
                                item={item}
                                removeItem={removeItem}
                                setJsonInput={setJsonInput}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JsonEditor
