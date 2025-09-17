import { withDB } from '@/app/api/utils/db'

import Test2 from './model'

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

// CREATE Test2
export async function createTest2(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const test2Data = await req.json()
            const newTest2 = await Test2.create({
                ...test2Data,
            })
            return formatResponse(
                newTest2,
                'Test2 created successfully',
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

// GET single Test2 by ID
export async function getTest2ById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Test2 ID is required', 400)

        const test2 = await Test2.findById(id)
        if (!test2)
            return formatResponse(null, 'Test2 not found', 404)

        return formatResponse(
            test2,
            'Test2 fetched successfully',
            200
        )
    })
}

// GET all Test2s with pagination
export async function getTest2s(req: Request): Promise<IResponse> {
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
                        { 'hobbys': { $regex: searchQuery, $options: 'i' } },
                        { 'ideas': { $regex: searchQuery, $options: 'i' } }
                ],
            }
        }

        const test2s = await Test2.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalTest2s =
            await Test2.countDocuments(searchFilter)

        return formatResponse(
            {
                test2s: test2s || [],
                total: totalTest2s,
                page,
                limit,
            },
            'Test2s fetched successfully',
            200
        )
    })
}

// UPDATE single Test2 by ID
export async function updateTest2(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedTest2 = await Test2.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedTest2)
                return formatResponse(null, 'Test2 not found', 404)
            return formatResponse(
                updatedTest2,
                'Test2 updated successfully',
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

// BULK UPDATE Test2s
export async function bulkUpdateTest2s(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Test2.findByIdAndUpdate(id, updateData, {
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

// DELETE single Test2 by ID
export async function deleteTest2(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedTest2 = await Test2.findByIdAndDelete(id)
        if (!deletedTest2)
            return formatResponse(
                null,
                'Test2 not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Test2 deleted successfully',
            200
        )
    })
}

// BULK DELETE Test2s
export async function bulkDeleteTest2s(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Test2.findById(id)
                if (doc) {
                    const deletedDoc = await Test2.findByIdAndDelete(id)
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
