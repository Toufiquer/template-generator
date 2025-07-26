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
        setJsonInput(JSON.stringify(data))
    }

    return (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 w-full">
                    <strong className="text-white">
                        {item.data.templateName} :{' '}
                    </strong>
                    Saved at: {item.timestamp.toLocaleString()}
                </span>
                <div className="w-full flex items-center justify-end gap-4">
                    <Button onClick={() => removeItem(item.id)} variant="fire">
                        Remove
                    </Button>
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
