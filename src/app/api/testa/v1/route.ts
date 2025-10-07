import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getTesta,
    createTesta,
    updateTesta,
    deleteTesta,
    getTestaById,
    bulkUpdateTesta,
    bulkDeleteTesta,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Testa
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getTestaById(req)
        : await getTesta(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Testa
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createTesta(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Testa
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateTesta(req)
        : await updateTesta(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Testa
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteTesta(req)
        : await deleteTesta(req);

    return formatResponse(result.data, result.message, result.status);
}