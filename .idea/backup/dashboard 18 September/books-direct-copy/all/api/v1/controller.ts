/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db'

import Book from './model'
import { IResponse } from './jwt-verify'
import { connectRedis, getRedisData } from './redis'

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
    data,
    message,
    status,
})

// CREATE Book
export async function createBook(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const bookData = await req.json()
            const newBook = await Book.create({
                ...bookData,
            })
            return formatResponse(newBook, 'Book created successfully', 201)
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// GET single Book by ID
export async function getBookById(req: Request) {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id) return formatResponse(null, 'Book ID is required', 400)

        const book = await Book.findById(id)
        if (!book) return formatResponse(null, 'Book not found', 404)

        return formatResponse(book, 'Book fetched successfully', 200)
    })
}

// GET all Books with pagination
export async function getBooks(req: Request) {
    await connectRedis()
    const getValue = await getRedisData('books')
    if (getValue) {
        const { books, totalBooks, page, limit } = JSON.parse(getValue)
        return formatResponse(
            {
                books: books || [],
                total: totalBooks,
                page,
                limit,
            },
            'Books fetched successfully',
            200
        )
    } else {
        return withDB(async () => {
            const url = new URL(req.url)
            const page = parseInt(url.searchParams.get('page') || '1', 10)
            const limit = parseInt(url.searchParams.get('limit') || '10', 10)
            const skip = (page - 1) * limit

            const searchQuery = url.searchParams.get('q')

            let searchFilter = {}

            // Apply search filter only if search query is provided
            if (searchQuery) {
                searchFilter = {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } },
                        { alias: { $regex: searchQuery, $options: 'i' } },
                    ],
                }
            }

            const books = await Book.find(searchFilter)
                .sort({ updatedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)

            const totalBooks = await Book.countDocuments(searchFilter)

            return formatResponse(
                {
                    books: books || [],
                    total: totalBooks,
                    page,
                    limit,
                },
                'Books fetched successfully',
                200
            )
        })
    }
}

// UPDATE single Book by ID
export async function updateBook(req: Request) {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            })

            if (!updatedBook) return formatResponse(null, 'Book not found', 404)
            return formatResponse(updatedBook, 'Book updated successfully', 200)
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// BULK UPDATE Books
export async function bulkUpdateBooks(req: Request) {
    return withDB(async () => {
        const updates = await req.json()
        const results = await Promise.allSettled(
            updates.map(
                ({
                    id,
                    updateData,
                }: {
                    id: string
                    updateData: Record<string, unknown>
                }) =>
                    Book.findByIdAndUpdate(id, updateData, {
                        new: true,
                        runValidators: true,
                    })
            )
        )

        const successfulUpdates = results
            .filter((r) => r.status === 'fulfilled' && r.value)
            .map((r) => (r as PromiseFulfilledResult<typeof Book>).value)
        const failedUpdates = results
            .filter((r) => r.status === 'rejected' || !r.value)
            .map((_, i) => updates[i].id)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single Book by ID
export async function deleteBook(req: Request) {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedBook = await Book.findByIdAndDelete(id)
        if (!deletedBook)
            return formatResponse(deletedBook, 'Book not found', 404)
        return formatResponse(
            { deletedCount: 1 },
            'Book deleted successfully',
            200
        )
    })
}

// BULK DELETE Books
export async function bulkDeleteBooks(req: Request) {
    return withDB(async () => {
        const { ids } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const book = await Book.findById(id)
                if (book) {
                    const deletedBook = await Book.findByIdAndDelete(id)
                    if (deletedBook) deletedIds.push(id)
                } else {
                    invalidIds.push(id)
                }
            } catch {
                invalidIds.push(id)
            }
        }

        return formatResponse(
            { deleted: deletedIds.length, deletedIds, invalidIds },
            'Bulk delete operation completed',
            200
        )
    })
}
