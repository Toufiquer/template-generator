/*
|-----------------------------------------
| setting up ViewDataType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, August, 2025
|-----------------------------------------
*/
'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { ScrollArea } from '@/components/ui/scroll-area'

const ViewDataType = () => {
    const allDataType = [
        'STRING',
        'EMAIL',
        'PASSWOR',
        'PASSCOD',
        'SELECT',
        'DYNAMICSELECT',
        'IMAGES',
        'IMAGE ',
        'DESCRIPTION',
        'INTNUMBER',
        'FLOATNUMBER',
        'BOOLEAN',
        'DATE ',
        'TIME',
        'DATERANGE',
        'TIMERANGE',
        'COLOEPICKER',
        'PHONE',
        'URL',
        'RICHTEXT',
        'AUTOCOMPLETE',
        'RADIOBUTTON',
        'CHECKBOX',
        'MULTICHECKBOX',
    ]

    const copyToClipboard = (data: string) => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                toast.success('Copied to clipboard')
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error('Failed to copy to clipboard')
            })
    }

    return (
        <Dialog>
            <DialogTrigger className="border-1 text-sm hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer">
                DataType
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Click to copy</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="w-full gap-2 flex flex-col pt-4">
                        {allDataType.map((curr) => (
                            <span
                                key={curr}
                                onClick={() => copyToClipboard(curr)}
                                className="cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                {curr}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDataType
