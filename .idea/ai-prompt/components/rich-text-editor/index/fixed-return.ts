interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming conventions provided in the JSON.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
}

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
export const generateRichTextEditorIndex = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}
    const folderName = namingConvention.users_2_000___
    return `    
'use client'

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'

import MenuBar from './menu-bar'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export default function RichTextEditor({
    content,
    onChange,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-3',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-3',
                    },
                },
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                    HTMLAttributes: {},
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'min-h-[156px] border py-2 px-3 prose prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    return (
        <div className="tiptap-editor">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
`
}
