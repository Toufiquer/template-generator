// ImageUploadFieldMultiple.tsx

'use client'

import Image from 'next/image'
import { Plus, X } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import ImageDialog from './ImageDialog'
import { useState } from 'react'

export default function ImageUploadFieldMultiple() {
    const [allMyImages, setAllMyImages] = useState<string[]>([])
    const newImages: string[] = []

    const handleAddImages = (newSelectImage: string) => {
        setAllMyImages([newSelectImage, ...allMyImages])
    }
    const handleRemoveImages = (newSelectImage: string) => {
        const othersImages = newImages.filter((i) => i !== newSelectImage)
        setAllMyImages([...othersImages])
    }
    const UploadButton = () => {
        return (
            <div>
                <Dialog>
                    <DialogTrigger>
                        <div className="border-slate-500 text-slate-600 hover:border-slate-600 border-1 cursor-pointer flex items-center justify-center px-2 rounded-lg text-sm py-1">
                            <Plus className="w-4 h-4" /> Add Image
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Please Select an Image</DialogTitle>
                        </DialogHeader>
                        <ImageDialog handleAddImages={handleAddImages} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
                <h2>Images</h2>
                <UploadButton />
            </div>
            <div className="w-full min-h-[10vh] rounded-lg flex items-center justify-center">
                {allMyImages.length > 0 ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                        {allMyImages.map((i, index) => (
                            <div
                                key={index + i}
                                onClick={() => handleRemoveImages(i)}
                                className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
                            >
                                <Image
                                    src={i}
                                    alt="Media"
                                    objectFit="cover"
                                    fill
                                />
                                <div className="absolute top-0 right-0 bg-rose-500 w-6 h-6 flex items-center justify-center rounded-full">
                                    <X className="text-white h-4 w-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col w-full items-center justify-center">
                        <p>Ops! there is no Image</p>
                    </div>
                )}
            </div>
        </div>
    )
}
