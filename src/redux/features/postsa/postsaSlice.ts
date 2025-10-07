// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const postsaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPostsa: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/postsa/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePostsa', id: 'LIST' }],
        }),
        getPostsaSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/postsa/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePostsa', id: 'LIST' }],
        }),
        getPostsaById: builder.query({
            query: (id) => `/api/postsa/v1?id=${id}`,
        }),
        addPostsa: builder.mutation({
            query: (newPosta) => ({
                url: '/api/postsa/v1',
                method: 'POST',
                body: newPosta,
            }),
            invalidatesTags: [{ type: 'tagTypePostsa' }],
        }),
        updatePostsa: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/postsa/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePostsa' }],
        }),
        deletePostsa: builder.mutation({
            query: ({ id }) => ({
                url: `/api/postsa/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePostsa' }],
        }),
        bulkUpdatePostsa: builder.mutation({
            query: (bulkData) => ({
                url: `/api/postsa/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePostsa' }],
        }),
        bulkDeletePostsa: builder.mutation({
            query: (bulkData) => ({
                url: `/api/postsa/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePostsa' }],
        }),
    }),
})

export const {
    useGetPostsaQuery,
    useGetPostsaSummaryQuery,
    useAddPostsaMutation,
    useUpdatePostsaMutation,
    useDeletePostsaMutation,
    useBulkUpdatePostsaMutation,
    useBulkDeletePostsaMutation,
    useGetPostsaByIdQuery,
} = postsaApi
