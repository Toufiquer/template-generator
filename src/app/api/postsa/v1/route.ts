import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPostsa,
    createPosta,
    updatePosta,
    deletePosta,
    getPostaById,
    bulkUpdatePostsa,
    bulkDeletePostsa,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Postsa
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPostaById(req)
        : await getPostsa(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Posta
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createPosta(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Posta
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePostsa(req)
        : await updatePosta(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Posta
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePostsa(req)
        : await deletePosta(req);

    return formatResponse(result.data, result.message, result.status);
}