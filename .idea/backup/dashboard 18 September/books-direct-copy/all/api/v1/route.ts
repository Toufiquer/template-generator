/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit'
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    getBookById,
    bulkUpdateBooks,
    bulkDeleteBooks,
} from './controller'

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify'

// GET all Books
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    // const tokenResponse = handleTokenVerify(req);
    // if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id')
    const result: IResponse = id ? await getBookById(req) : await getBooks(req)
    return formatResponse(result.data, result.message, result.status)
}

// CREATE Book
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    // const tokenResponse = handleTokenVerify(req);
    // if (tokenResponse) return tokenResponse;

    const result = await createBook(req)
    return formatResponse(result.data, result.message, result.status)
}

// UPDATE Book
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    // const tokenResponse = handleTokenVerify(req);
    // if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true'
    const result = isBulk ? await bulkUpdateBooks(req) : await updateBook(req)

    return formatResponse(result.data, result.message, result.status)
}

// DELETE Book
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    // const tokenResponse = handleTokenVerify(req);
    // if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true'
    const result = isBulk ? await bulkDeleteBooks(req) : await deleteBook(req)

    return formatResponse(result.data, result.message, result.status)
}
