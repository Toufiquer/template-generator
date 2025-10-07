import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPostsb,
    createPostb,
    updatePostb,
    deletePostb,
    getPostbById,
    bulkUpdatePostsb,
    bulkDeletePostsb,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Postsb
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPostbById(req)
        : await getPostsb(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Postb
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createPostb(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Postb
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePostsb(req)
        : await updatePostb(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Postb
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePostsb(req)
        : await deletePostb(req);

    return formatResponse(result.data, result.message, result.status);
}