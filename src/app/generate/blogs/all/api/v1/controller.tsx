import { withDB } from '@/app/api/utils/db'

import Blog from './model'

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
})

// CREATE Blog
export async function createBlog(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const blogsData = await req.json()
            const newBlog = await Blog.create({
                ...blogsData,
            })
            return formatResponse(
                newBlog,
                'Blog created successfully',
                201
            )
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

// GET single Blog by ID
export async function getBlogById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Blog ID is required', 400)

        const blogs = await Blog.findById(id)
        if (!blogs)
            return formatResponse(null, 'Blog not found', 404)

        return formatResponse(
            blogs,
            'Blog fetched successfully',
            200
        )
    })
}

// GET all Blogs with pagination
export async function getBlogs(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit

        const searchQuery = url.searchParams.get('q')

        let searchFilter = {}

        // Apply search filter only if a search query is provided
        if (searchQuery) {
            searchFilter = {
                $or: [
                        { 'title': { $regex: searchQuery, $options: 'i' } },
                        { 'email': { $regex: searchQuery, $options: 'i' } },
                        { 'password': { $regex: searchQuery, $options: 'i' } },
                        { 'passcode': { $regex: searchQuery, $options: 'i' } },
                        { 'area': { $regex: searchQuery, $options: 'i' } },
                        { 'books-list': { $regex: searchQuery, $options: 'i' } },
                        { 'check-list': { $regex: searchQuery, $options: 'i' } },
                        { 'sub-area': { $regex: searchQuery, $options: 'i' } },
                        { 'products-images': { $regex: searchQuery, $options: 'i' } },
                        { 'personal-image': { $regex: searchQuery, $options: 'i' } },
                        { 'description': { $regex: searchQuery, $options: 'i' } },
                        { 'age': { $regex: searchQuery, $options: 'i' } },
                        { 'amount': { $regex: searchQuery, $options: 'i' } },
                        { 'isActive': { $regex: searchQuery, $options: 'i' } },
                        { 'start-date': { $regex: searchQuery, $options: 'i' } },
                        { 'start-time': { $regex: searchQuery, $options: 'i' } },
                        { 'schedule-date': { $regex: searchQuery, $options: 'i' } },
                        { 'schedule-time': { $regex: searchQuery, $options: 'i' } },
                        { 'favorite-color': { $regex: searchQuery, $options: 'i' } },
                        { 'number': { $regex: searchQuery, $options: 'i' } },
                        { 'profile': { $regex: searchQuery, $options: 'i' } },
                        { 'test': { $regex: searchQuery, $options: 'i' } },
                        { 'info': { $regex: searchQuery, $options: 'i' } },
                        { 'shift': { $regex: searchQuery, $options: 'i' } },
                        { 'policy': { $regex: searchQuery, $options: 'i' } },
                        { 'hobbys': { $regex: searchQuery, $options: 'i' } }
                ],
            }
        }

        const blogs = await Blog.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalBlogs =
            await Blog.countDocuments(searchFilter)

        return formatResponse(
            {
                blogs: blogs || [],
                total: totalBlogs,
                page,
                limit,
            },
            'Blogs fetched successfully',
            200
        )
    })
}

// UPDATE single Blog by ID
export async function updateBlog(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedBlog = await Blog.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedBlog)
                return formatResponse(null, 'Blog not found', 404)
            return formatResponse(
                updatedBlog,
                'Blog updated successfully',
                200
            )
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

// BULK UPDATE Blogs
export async function bulkUpdateBlogs(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Blog.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value)
            .map((r) => r.value)
            
        const failedUpdates = results
            .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
            .filter((id): id is string => id !== null)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single Blog by ID
export async function deleteBlog(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (!deletedBlog)
            return formatResponse(
                null,
                'Blog not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Blog deleted successfully',
            200
        )
    })
}

// BULK DELETE Blogs
export async function bulkDeleteBlogs(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Blog.findById(id)
                if (doc) {
                    const deletedDoc = await Blog.findByIdAndDelete(id)
                    if (deletedDoc) {
                        deletedIds.push(id)
                    }
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
