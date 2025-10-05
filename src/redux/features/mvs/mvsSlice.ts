// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const mvsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMvs: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/mvs/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeMvs', id: 'LIST' }],
        }),
        getMvsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/mvs/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeMvs', id: 'LIST' }],
        }),
        getMvsById: builder.query({
            query: (id) => `/api/mvs/v1?id=${id}`,
        }),
        addMvs: builder.mutation({
            query: (newMv) => ({
                url: '/api/mvs/v1',
                method: 'POST',
                body: newMv,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs' }],
        }),
        updateMvs: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/mvs/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeMvs' }],
        }),
        deleteMvs: builder.mutation({
            query: ({ id }) => ({
                url: `/api/mvs/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeMvs' }],
        }),
        bulkUpdateMvs: builder.mutation({
            query: (bulkData) => ({
                url: `/api/mvs/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs' }],
        }),
        bulkDeleteMvs: builder.mutation({
            query: (bulkData) => ({
                url: `/api/mvs/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs' }],
        }),
    }),
})

export const {
    useGetMvsQuery,
    useGetMvsSummaryQuery,
    useAddMvsMutation,
    useUpdateMvsMutation,
    useDeleteMvsMutation,
    useBulkUpdateMvsMutation,
    useBulkDeleteMvsMutation,
    useGetMvsByIdQuery,
} = mvsApi
