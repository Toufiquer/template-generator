// InputFieldForString.tsx

import { Input } from '@/components/ui/input'
const InputFieldForString = ({
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
export default InputFieldForString
