/**
 * Generates the entire Controller.ts file content as a string based on a JSON configuration.
 *
 * This function parses the JSON to extract naming conventions and a data schema. It then
 * uses a template to build the controller's TypeScript code, dynamically inserting the correct
 * names for models, variables, and functions. It also recursively traverses the schema to
 * build a comprehensive search filter that includes all specified fields, including nested ones.
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted Controller.ts file as a string.
 */
export const generateCustomButton = (): string => {
    
    return `'use client'

import Link from 'next/link'

const CustomLInk = (i: { name: string; url: string }) => {
    return (
        <Link
            href={i.url}
            className="w-full hover:bg-slate-400 bg-slate-300 block p-1 border-1 border-slate-400 "
        >
            {i.name}
        </Link>
    )
}
export default CustomLInk

`
}
