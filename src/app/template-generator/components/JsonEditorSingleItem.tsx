/*
|-----------------------------------------
| setting up JsonEditorSingleItem for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, July, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button'
import { JsonItem } from '@/lib/store/jsonStore'
import { useState } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const JsonEditorSingleItem = ({
    item,
    removeItem,
    setJsonInput,
}: {
    item: JsonItem
    setJsonInput: React.Dispatch<React.SetStateAction<string>>
    removeItem: (id: string) => void
}) => {
    const [collasp, setCollasp] = useState(false)

    const handleSetJosn = (data: string) => {
        setJsonInput(JSON.stringify(data, null, 2))
    }

    return (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-300 dark:bg-gray-700 ">
            <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 w-full">
                    <strong className="dark:text-white text-gray-900">
                        {item.data.templateName} :{' '}
                    </strong>
                    Saved at: {item.timestamp.toLocaleString()}
                </span>
                <div className="w-full flex items-center justify-end gap-4">
                    <AlertDialog>
                        <AlertDialogTrigger className="px-4 py-2 cursor-pointer bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                            Remove
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="px-4 py-2 cursor-pointer bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                                    <button onClick={() => removeItem(item.id)}>
                                        Remove
                                    </button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        onClick={() => setCollasp(!collasp)}
                        variant="garden"
                    >
                        {collasp ? 'Colasp' : 'View'}
                    </Button>
                    <Button
                        onClick={() => handleSetJosn(item.data)}
                        variant="secondary"
                    >
                        Edit
                    </Button>
                </div>
            </div>
            {collasp && (
                <pre className=" p-3 rounded border text-sm overflow-x-auto bg-slate-900 my-2">
                    {JSON.stringify(item.data, null, 2)}
                </pre>
            )}
        </div>
    )
}
export default JsonEditorSingleItem
