import { Input } from '@/components/ui/input'

/*
|-----------------------------------------
| setting up InputFieldForPasscode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/
const InputFieldForPasscode = () => {
    return (
        <div>
            <small>Only number 4 digits allowed</small>
            <Input placeholder="********" type="password" />
        </div>
    )
}
export default InputFieldForPasscode
