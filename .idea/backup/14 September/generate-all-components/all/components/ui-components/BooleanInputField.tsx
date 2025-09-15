// BooleanInputField.tsx
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function BooleanInputField({
    id,
    checked,
    onCheckedChange,
}: {
    id: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}) {
    return (
        <div id={id} className="flex items-center space-x-2">
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
            <Label htmlFor={id}>{id}</Label>
        </div>
    )
}
