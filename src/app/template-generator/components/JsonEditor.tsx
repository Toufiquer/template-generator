// components/JsonEditor.tsx
'use client'

import React, { useState } from 'react'
import { useJsonStore } from '@/lib/store/jsonStore'

const JsonEditor: React.FC = () => {
    const [jsonInput, setJsonInput] = useState<string>(
        '{\n  "uid": "000",\n  "name": "Basic Template"\n}'
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

            // Add to Zustand store
            addItem(parsedJson)

            // Optional: Clear input after successful save
            // setJsonInput('');
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

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className=" rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray- 800 dark:text-gray-100 mb-4">
                    JSON Editor
                </h2>

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
                        className="w-full h-64 p-4 min-w-7xl border bg-gray-400 border-gray-300 rounded-md font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Enter your JSON data here..."
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm  p-3 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !jsonInput.trim()}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Saved Items Display */}
            <div className=" rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-600">
                        Saved Items ({items.length})
                    </h3>
                    {items.length > 0 && (
                        <button
                            onClick={clearItems}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No items saved yet. Add some JSON data above!
                    </p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-md p-4 bg-gray-50"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-gray-500">
                                        Saved at:{' '}
                                        {item.timestamp.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <pre className=" p-3 rounded border text-sm overflow-x-auto">
                                    {JSON.stringify(item.data, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JsonEditor
