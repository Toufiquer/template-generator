import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    bulkUpdateBlogs,
    bulkDeleteBlogs,
} from './controller';

import {
    formatResponse,
    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Blogs
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getBlogById(req)
        : await getBlogs(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Blog
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const result = await createBlog(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Blog
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateBlogs(req)
        : await updateBlog(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Blog
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteBlogs(req)
        : await deleteBlog(req);

    return formatResponse(result.data, result.message, result.status);
}