import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getTest2s,
    createTest2,
    updateTest2,
    deleteTest2,
    getTest2ById,
    bulkUpdateTest2s,
    bulkDeleteTest2s,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Test2s
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getTest2ById(req)
        : await getTest2s(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Test2
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createTest2(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Test2
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateTest2s(req)
        : await updateTest2(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Test2
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteTest2s(req)
        : await deleteTest2(req);

    return formatResponse(result.data, result.message, result.status);
}