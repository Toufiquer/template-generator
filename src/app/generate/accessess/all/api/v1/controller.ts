import { withDB } from '@/app/api/utils/db'

import Access from './model'

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

// CREATE Access
export async function createAccess(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const accessData = await req.json()
            const newAccess = await Access.create({
                ...accessData,
            })
            return formatResponse(
                newAccess,
                'Access created successfully',
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

// GET single Access by ID
export async function getAccessById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Access ID is required', 400)

        const access = await Access.findById(id)
        if (!access)
            return formatResponse(null, 'Access not found', 404)

        return formatResponse(
            access,
            'Access fetched successfully',
            200
        )
    })
}

// GET all Accesses with pagination
export async function getAccesses(req: Request): Promise<IResponse> {
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
                        { 'student': { $regex: searchQuery, $options: 'i' } },
                        { 'admin': { $regex: searchQuery, $options: 'i' } },
                        { 'moderator': { $regex: searchQuery, $options: 'i' } },
                        { 'mentor': { $regex: searchQuery, $options: 'i' } },
                        { 'instructor': { $regex: searchQuery, $options: 'i' } }
                ],
            }
        }

        const accessess = await Access.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalAccesses =
            await Access.countDocuments(searchFilter)

        return formatResponse(
            {
                accessess: accessess || [],
                total: totalAccesses,
                page,
                limit,
            },
            'Accesses fetched successfully',
            200
        )
    })
}

// UPDATE single Access by ID
export async function updateAccess(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedAccess = await Access.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedAccess)
                return formatResponse(null, 'Access not found', 404)
            return formatResponse(
                updatedAccess,
                'Access updated successfully',
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

// BULK UPDATE Accesses
export async function bulkUpdateAccesses(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Access.findByIdAndUpdate(id, updateData, {
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

// DELETE single Access by ID
export async function deleteAccess(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedAccess = await Access.findByIdAndDelete(id)
        if (!deletedAccess)
            return formatResponse(
                null,
                'Access not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Access deleted successfully',
            200
        )
    })
}

// BULK DELETE Accesses
export async function bulkDeleteAccesses(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Access.findById(id)
                if (doc) {
                    const deletedDoc = await Access.findByIdAndDelete(id)
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
