import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMvs,
    createMv,
    updateMv,
    deleteMv,
    getMvById,
    bulkUpdateMvs,
    bulkDeleteMvs,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Mvs
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMvById(req)
        : await getMvs(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Mv
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMv(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Mv
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMvs(req)
        : await updateMv(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Mv
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMvs(req)
        : await deleteMv(req);

    return formatResponse(result.data, result.message, result.status);
}