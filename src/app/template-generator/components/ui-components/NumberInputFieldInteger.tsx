/*
|-----------------------------------------
| setting up NumberInputFieldInteger for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/ import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const NumberInputFieldInteger = () => {
    const min = 0
    const max = 100000
    const [quantity, setQuantity] = useState<number | undefined>(1)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value
        const parsedValue = parseInt(rawValue, 10)

        // If the input is empty, null, or not a valid number, we might want to pass undefined or 0
        // depending on desired behavior. Here, we'll pass undefined for empty/invalid.
        if (isNaN(parsedValue) || rawValue.trim() === '') {
            setQuantity?.(undefined)
        } else {
            let finalValue = parsedValue

            // Apply min/max constraints if provided
            if (min !== undefined && finalValue < min) {
                finalValue = min
            }
            if (max !== undefined && finalValue > max) {
                finalValue = max
            }

            setQuantity?.(finalValue)
        }
    }

    // Ensure the displayed value is always an integer or empty string if undefined/null
    const displayValue =
        quantity !== undefined && quantity !== null
            ? String(Math.floor(quantity))
            : ''
    return (
        <Input
            placeholder="Quantity"
            type="number" // Use type="number" for browser's numeric keyboard and basic validation
            inputMode="numeric" // Helps with mobile keyboard types
            pattern="[0-9]*" // Further hint for numeric input
            value={displayValue}
            onChange={handleChange}
            onKeyDown={(e) => {
                // Prevent decimal points and 'e' (for scientific notation)
                if (e.key === '.' || e.key === 'e' || e.key === '-') {
                    e.preventDefault()
                }
            }}
            min={min}
            max={max}
        />
    )
}

export default NumberInputFieldInteger
