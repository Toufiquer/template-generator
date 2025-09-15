// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const test2sApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTest2s: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/test2s/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeTest2s', id: 'LIST' }],
        }),
        getTest2sById: builder.query({
            query: (id) => `/generate/test2s/all/api/v1?id=${id}`,
        }),
        addTest2s: builder.mutation({
            query: (newTest2) => ({
                url: '/generate/test2s/all/api/v1',
                method: 'POST',
                body: newTest2,
            }),
            invalidatesTags: [{ type: 'tagTypeTest2s' }],
        }),
        updateTest2s: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/test2s/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeTest2s' }],
        }),
        deleteTest2s: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/test2s/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeTest2s' }],
        }),
        bulkUpdateTest2s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/test2s/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeTest2s' }],
        }),
        bulkDeleteTest2s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/test2s/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeTest2s' }],
        }),
    }),
})

export const {
    useGetTest2sQuery,
    useAddTest2sMutation,
    useUpdateTest2sMutation,
    useDeleteTest2sMutation,
    useBulkUpdateTest2sMutation,
    useBulkDeleteTest2sMutation,
    useGetTest2sByIdQuery,
} = test2sApi
