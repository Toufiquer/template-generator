// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const postsbApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPostsb: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/postsb/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePostsb', id: 'LIST' }],
        }),
        getPostsbSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/postsb/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePostsb', id: 'LIST' }],
        }),
        getPostsbById: builder.query({
            query: (id) => `/api/postsb/v1?id=${id}`,
        }),
        addPostsb: builder.mutation({
            query: (newPostb) => ({
                url: '/api/postsb/v1',
                method: 'POST',
                body: newPostb,
            }),
            invalidatesTags: [{ type: 'tagTypePostsb' }],
        }),
        updatePostsb: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/postsb/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePostsb' }],
        }),
        deletePostsb: builder.mutation({
            query: ({ id }) => ({
                url: `/api/postsb/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePostsb' }],
        }),
        bulkUpdatePostsb: builder.mutation({
            query: (bulkData) => ({
                url: `/api/postsb/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePostsb' }],
        }),
        bulkDeletePostsb: builder.mutation({
            query: (bulkData) => ({
                url: `/api/postsb/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePostsb' }],
        }),
    }),
})

export const {
    useGetPostsbQuery,
    useGetPostsbSummaryQuery,
    useAddPostsbMutation,
    useUpdatePostsbMutation,
    useDeletePostsbMutation,
    useBulkUpdatePostsbMutation,
    useBulkDeletePostsbMutation,
    useGetPostsbByIdQuery,
} = postsbApi
