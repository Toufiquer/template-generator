// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const blogsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/dashboard/blogs/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeBlogs', id: 'LIST' }],
        }),
        getBlogsById: builder.query({
            query: (id) => `/dashboard/blogs/all/api/v1?id=${id}`,
        }),
        addBlogs: builder.mutation({
            query: (newBlog) => ({
                url: '/dashboard/blogs/all/api/v1',
                method: 'POST',
                body: newBlog,
            }),
            invalidatesTags: [{ type: 'tagTypeBlogs' }],
        }),
        updateBlogs: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/dashboard/blogs/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeBlogs' }],
        }),
        deleteBlogs: builder.mutation({
            query: ({ id }) => ({
                url: `/dashboard/blogs/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeBlogs' }],
        }),
        bulkUpdateBlogs: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/blogs/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBlogs' }],
        }),
        bulkDeleteBlogs: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/blogs/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBlogs' }],
        }),
    }),
})

export const {
    useGetBlogsQuery,
    useAddBlogsMutation,
    useUpdateBlogsMutation,
    useDeleteBlogsMutation,
    useBulkUpdateBlogsMutation,
    useBulkDeleteBlogsMutation,
    useGetBlogsByIdQuery,
} = blogsApi
