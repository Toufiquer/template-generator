'use client'

import { useState } from 'react'

// Mock UI components for demonstration
const InputFieldForString = () => (
    <input
        className="w-full p-2 rounded-md border bg-white/10 backdrop-blur-sm"
        placeholder="Enter text..."
    />
)
const InputFieldForEmail = () => (
    <input
        className="w-full p-2 rounded-md border bg-white/10 backdrop-blur-sm"
        placeholder="email@example.com"
        type="email"
    />
)
const SelectField = () => (
    <select className="w-full p-2 rounded-md border bg-white/10 backdrop-blur-sm">
        <option>Option 1</option>
        <option>Option 2</option>
    </select>
)
const CheckboxField = () => (
    <input type="checkbox" className="w-4 h-4 rounded" />
)

interface DataTypeItem {
    name: string
    mongooseSchema: string
    ui: string
    coreCode?: string
}

const allDataType: DataTypeItem[] = [
    {
        name: 'STRING',
        mongooseSchema: `STRING: {
    type: String,
    trim: true
}`,
        ui: '<InputFieldForString />',
        coreCode:
            'const InputFieldForString = () => {\n  return (\n    <input\n      className="w-full p-2 rounded-md"\n      placeholder="Enter text..."\n    />\n  )\n}',
    },
    {
        name: 'EMAIL',
        mongooseSchema: `EMAIL: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address']
}`,
        ui: '<InputFieldForEmail />',
    },
    {
        name: 'SELECT',
        mongooseSchema: `SELECT: {
    type: String,
    enum: ['Option 1', 'Option 2', 'Option 3']
}`,
        ui: '<SelectField />',
    },
    {
        name: 'CHECKBOX',
        mongooseSchema: `CHECKBOX: {
    type: Boolean,
    default: false
}`,
        ui: '<CheckboxField />',
    },
]

const ViewDataType = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)
    const [currentPreviewItem, setCurrentPreviewItem] =
        useState<DataTypeItem | null>(null)
    const [activeTab, setActiveTab] = useState('both')

    const copyToClipboard = (
        data: string,
        type: 'schema' | 'ui' | 'name' | 'corecode'
    ) => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                // Toast notification would go here
                console.log(`Copied ${type} to clipboard!`)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
            })
    }

    const getComponentForPreview = (item: DataTypeItem): React.ReactNode => {
        switch (item.ui) {
            case '<InputFieldForString />':
                return <InputFieldForString />
            case '<InputFieldForEmail />':
                return <InputFieldForEmail />
            case '<SelectField />':
                return <SelectField />
            case '<CheckboxField />':
                return <CheckboxField />
            default:
                return (
                    <p className="text-white/70">
                        No preview available for {item.name}
                    </p>
                )
        }
    }

    const handleViewDetails = (item: DataTypeItem) => {
        setCurrentPreviewItem(item)
        setShowPreviewDialog(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
            {/* Trigger Button */}
            <button
                onClick={() => setIsDialogOpen(true)}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border border-white/20 px-6 py-3 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16"
                        />
                    </svg>
                    DataType Library
                </span>
            </button>

            {/* Main Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsDialogOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Data Types Overview
                            </h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-white/70"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                {allDataType.map((curr, index) => (
                                    <div
                                        key={curr.name}
                                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-white/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-white">
                                                    {index + 1}
                                                </div>
                                                <span className="font-semibold text-lg text-white">
                                                    {curr.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(curr)
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/20 text-blue-300 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            curr.name,
                                                            'name'
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-400/20 text-emerald-300 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                                                >
                                                    Copy Name
                                                </button>
                                                {curr.coreCode && (
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                curr.coreCode ||
                                                                    '',
                                                                'corecode'
                                                            )
                                                        }
                                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/20 text-purple-300 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                                                    >
                                                        Copy Code
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Dialog */}
            {showPreviewDialog && currentPreviewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPreviewDialog(false)}
                    />
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                Details:{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    {currentPreviewItem.name}
                                </span>
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            currentPreviewItem.mongooseSchema,
                                            'schema'
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/20 text-blue-300 text-sm font-medium transition-all duration-300 hover:scale-105"
                                >
                                    Copy Schema
                                </button>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            currentPreviewItem.ui,
                                            'ui'
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-400/20 text-emerald-300 text-sm font-medium transition-all duration-300 hover:scale-105"
                                >
                                    Copy UI
                                </button>
                                <button
                                    onClick={() => setShowPreviewDialog(false)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5 text-white/70"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 pt-4">
                            <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1">
                                {[
                                    { id: 'both', label: 'Both' },
                                    { id: 'schema', label: 'Schema Only' },
                                    { id: 'ui', label: 'UI Only' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white shadow-lg'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {activeTab === 'both' && (
                                <div className="space-y-6">
                                    {/* Schema Section */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7"
                                                    />
                                                </svg>
                                            </div>
                                            Mongoose Schema
                                        </h3>
                                        <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                                            <pre className="p-4 text-sm text-emerald-300 font-mono overflow-x-auto">
                                                <code>
                                                    {
                                                        currentPreviewItem.mongooseSchema
                                                    }
                                                </code>
                                            </pre>
                                        </div>
                                    </div>

                                    {/* UI Section */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            UI Component
                                        </h3>

                                        {/* Component Preview */}
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 min-h-[120px] flex items-center justify-center">
                                            {getComponentForPreview(
                                                currentPreviewItem
                                            )}
                                        </div>

                                        {/* Core Code */}
                                        {currentPreviewItem.coreCode && (
                                            <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                                                <div className="absolute top-3 right-3">
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                currentPreviewItem.coreCode ||
                                                                    '',
                                                                'corecode'
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                                                    >
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        Copy
                                                    </button>
                                                </div>
                                                <pre className="p-4 pt-12 text-sm text-emerald-300 font-mono overflow-x-auto">
                                                    <code>
                                                        {
                                                            currentPreviewItem.coreCode
                                                        }
                                                    </code>
                                                </pre>
                                            </div>
                                        )}

                                        {/* Component Usage */}
                                        <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            currentPreviewItem.ui,
                                                            'ui'
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    Copy
                                                </button>
                                            </div>
                                            <pre className="p-4 pr-20 text-sm text-blue-300 font-mono">
                                                <code>
                                                    {currentPreviewItem.ui}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'schema' && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7"
                                                />
                                            </svg>
                                        </div>
                                        Mongoose Schema
                                    </h3>
                                    <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                                        <pre className="p-6 text-sm text-emerald-300 font-mono overflow-x-auto">
                                            <code>
                                                {
                                                    currentPreviewItem.mongooseSchema
                                                }
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ui' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        UI Component
                                    </h3>

                                    {/* Component Preview */}
                                    <div className="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 min-h-[200px] flex items-center justify-center">
                                        {getComponentForPreview(
                                            currentPreviewItem
                                        )}
                                    </div>

                                    {/* Component Usage */}
                                    <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                                        <pre className="p-4 text-sm text-blue-300 font-mono">
                                            <code>{currentPreviewItem.ui}</code>
                                        </pre>
                                    </div>

                                    {/* Core Code */}
                                    {currentPreviewItem.coreCode && (
                                        <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            currentPreviewItem.coreCode ||
                                                                '',
                                                            'corecode'
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    Copy
                                                </button>
                                            </div>
                                            <pre className="p-4 pt-12 text-sm text-emerald-300 font-mono overflow-x-auto">
                                                <code>
                                                    {
                                                        currentPreviewItem.coreCode
                                                    }
                                                </code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewDataType
