// InputFieldForEmail.tsx

import { Input } from '@/components/ui/input'

const InputFieldForEmail = ({
    id,
    value,
    onChange,
}: {
    id: string
    value: string
    onChange: (e: any) => void
}) => {
    return <Input id={id} value={value} onChange={onChange} />
}
export default InputFieldForEmail
