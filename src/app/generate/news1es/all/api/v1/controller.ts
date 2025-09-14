import { withDB } from '@/app/api/utils/db'

import News1 from './model'

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

// CREATE News1
export async function createNews1(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const news1Data = await req.json()
            const newNews1 = await News1.create({
                ...news1Data,
            })
            return formatResponse(
                newNews1,
                'News1 created successfully',
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

// GET single News1 by ID
export async function getNews1ById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'News1 ID is required', 400)

        const news1 = await News1.findById(id)
        if (!news1)
            return formatResponse(null, 'News1 not found', 404)

        return formatResponse(
            news1,
            'News1 fetched successfully',
            200
        )
    })
}

// GET all News1es with pagination
export async function getNews1es(req: Request): Promise<IResponse> {
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
                        { 'title1': { $regex: searchQuery, $options: 'i' } },
                        { 'title2': { $regex: searchQuery, $options: 'i' } },
                        { 'title3': { $regex: searchQuery, $options: 'i' } },
                        { 'title4': { $regex: searchQuery, $options: 'i' } },
                        { 'title5': { $regex: searchQuery, $options: 'i' } },
                        { 'title6': { $regex: searchQuery, $options: 'i' } }
                ],
            }
        }

        const news1es = await News1.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalNews1es =
            await News1.countDocuments(searchFilter)

        return formatResponse(
            {
                news1es: news1es || [],
                total: totalNews1es,
                page,
                limit,
            },
            'News1es fetched successfully',
            200
        )
    })
}

// UPDATE single News1 by ID
export async function updateNews1(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedNews1 = await News1.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedNews1)
                return formatResponse(null, 'News1 not found', 404)
            return formatResponse(
                updatedNews1,
                'News1 updated successfully',
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

// BULK UPDATE News1es
export async function bulkUpdateNews1es(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                News1.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value)
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

// DELETE single News1 by ID
export async function deleteNews1(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedNews1 = await News1.findByIdAndDelete(id)
        if (!deletedNews1)
            return formatResponse(
                null,
                'News1 not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'News1 deleted successfully',
            200
        )
    })
}

// BULK DELETE News1es
export async function bulkDeleteNews1es(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await News1.findById(id)
                if (doc) {
                    const deletedDoc = await News1.findByIdAndDelete(id)
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
