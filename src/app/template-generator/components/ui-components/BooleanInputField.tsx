/*
|-----------------------------------------
| setting up InputFieldForString for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function BooleanInputField() {
    return (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    )
}
