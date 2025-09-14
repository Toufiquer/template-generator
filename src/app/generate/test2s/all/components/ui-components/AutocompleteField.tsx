// AutocompleteField.tsx
import { Input } from '@/components/ui/input'
const AutocompleteField = ({ id, value }: { id: string; value: string }) => {
    return (
        <Input
            placeholder="Your Name Read Only"
            value={value}
            id={id}
            readOnly
        />
    )
}
export default AutocompleteField
