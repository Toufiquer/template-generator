// InputFieldForEmail.tsx

import { Input } from '@/components/ui/input'

const InputFieldForEmail = ({
    id,
    value,
    onChange,
    placeholder = 'Email',
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
export default InputFieldForEmail
