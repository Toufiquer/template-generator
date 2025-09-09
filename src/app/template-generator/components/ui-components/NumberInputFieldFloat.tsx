/*
|-----------------------------------------
| setting up NumberInputFieldFloat for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, September, 2025
|-----------------------------------------
*/
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const NumberInputFieldFloat = () => {
    // Renamed component to reflect its new purpose
    const min = 0
    const max = 100000
    const step = 0.01 // Added a default step for float values

    const [quantity, setQuantity] = useState<number | undefined>(1.0) // Initial quantity can now be a float

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value
        const parsedValue = parseFloat(rawValue) // Changed to parseFloat

        // If the input is empty or not a valid number after parsing
        if (isNaN(parsedValue) || rawValue.trim() === '') {
            setQuantity(undefined) // Pass undefined for empty/invalid
        } else {
            let finalValue = parsedValue

            // Apply min/max constraints
            if (min !== undefined && finalValue < min) {
                finalValue = min
            }
            if (max !== undefined && finalValue > max) {
                finalValue = max
            }
            setQuantity(finalValue)
        }
    }

    // Ensure the displayed value is a string representation of the float or an empty string
    const displayValue =
        quantity !== undefined && quantity !== null ? String(quantity) : ''

    return (
        <Input
            placeholder="Quantity"
            type="number"
            inputMode="decimal" // Changed to 'decimal' for better mobile keyboard
            pattern="[0-9]*\.?[0-9]*" // Pattern allowing optional decimal point
            value={displayValue}
            onChange={handleChange}
            onKeyDown={(e) => {
                // Allow decimal points (remove e.key === '.')
                // Prevent 'e' for scientific notation
                // Allow '-' only at the beginning and only once
                if (
                    e.key === 'e' ||
                    (e.key === '-' &&
                        (displayValue.includes('-') ||
                            e.currentTarget.selectionStart !== 0))
                ) {
                    e.preventDefault()
                }
            }}
            min={min}
            max={max}
            step={step} // Added step prop for float increments
        />
    )
}

export default NumberInputFieldFloat
