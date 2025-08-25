import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAccesses,
    createAccess,
    updateAccess,
    deleteAccess,
    getAccessById,
    bulkUpdateAccesses,
    bulkDeleteAccesses,
} from './controller';

import {
    formatResponse,
    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Accesses
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAccessById(req)
        : await getAccesses(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Access
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const result = await createAccess(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Access
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAccesses(req)
        : await updateAccess(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Access
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAccesses(req)
        : await deleteAccess(req);

    return formatResponse(result.data, result.message, result.status);
}