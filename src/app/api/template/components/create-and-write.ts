import { NextResponse } from 'next/server'

import fs from 'fs'
import path from 'path'

const writeInFile = (contentPage: string, filePath: string) => {
    try {
        const newFilePath = path.join(process.cwd(), filePath)
        const dirPath = path.dirname(newFilePath)

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }

        // Write the file
        fs.writeFileSync(newFilePath, contentPage, 'utf8')

        console.log('File created successfully')
        return { message: 'File created successfully' }
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred'
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}

// // Example usage:
// const content = `
//   const Page = () => {
//     return <main>Page Render </main>;
//   };

//   export default Page;
// `

// const newFilePath = 'src/app/generate/example/page.tsx'

// writeInFile(content, newFilePath)

export default writeInFile
