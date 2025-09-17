// InputFieldForString.tsx

import { Input } from '@/components/ui/input'
const InputFieldForString = ({
    id,
    value,
    onChange,
    placeholder = 'Please write...',
}: {
    id: string
    value: string
    onChange: (e: unknown) => void
    placeholder?: string
}) => {
    return (
        <Input
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}
export default InputFieldForString
