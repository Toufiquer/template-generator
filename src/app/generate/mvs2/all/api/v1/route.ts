import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMvs2,
    createMv2,
    updateMv2,
    deleteMv2,
    getMv2ById,
    bulkUpdateMvs2,
    bulkDeleteMvs2,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Mvs2
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMv2ById(req)
        : await getMvs2(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Mv2
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMv2(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Mv2
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMvs2(req)
        : await updateMv2(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Mv2
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMvs2(req)
        : await deleteMv2(req);

    return formatResponse(result.data, result.message, result.status);
}