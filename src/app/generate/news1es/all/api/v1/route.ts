import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getNews1es,
    createNews1,
    updateNews1,
    deleteNews1,
    getNews1ById,
    bulkUpdateNews1es,
    bulkDeleteNews1es,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all News1es
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getNews1ById(req)
        : await getNews1es(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE News1
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createNews1(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE News1
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateNews1es(req)
        : await updateNews1(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE News1
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteNews1es(req)
        : await deleteNews1(req);

    return formatResponse(result.data, result.message, result.status);
}