import { Button } from '@/components/ui/button'
import {
    ISavedInterfaceToLocalDB,
    useInterfaceStore,
} from '@/lib/store/mainStore'
import { useState } from 'react'
import { toast } from 'react-toastify'

const GenerateCode = ({
    currentInterface,
}: {
    currentInterface: ISavedInterfaceToLocalDB
}) => {
    const { setPreViewPath } = useInterfaceStore()
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = async (): Promise<void> => {
        setIsLoading(true)

        try {
            const title =
                currentInterface.content.toLowerCase().replace(/ /g, '-') ||
                'default'
            const response = await fetch('/api/generate-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: currentInterface.content,
                    folderName: title,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`file for ${title} created successfully!`)
                setPreViewPath(`/generate/${title}`)
            } else {
                toast.error(`Error: ${data.message}`)
                console.error('Error creating file:', data.message)
            }
        } catch (error) {
            toast.error('Failed to create file')
            console.error('Network error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            {/* Generate button */}
            <Button
                type="button"
                variant="garden"
                size="sm"
                onClick={handleGenerate}
                disabled={!currentInterface.content.trim() || isLoading}
                className="w-[180px]"
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </Button>
        </main>
    )
}

export default GenerateCode
