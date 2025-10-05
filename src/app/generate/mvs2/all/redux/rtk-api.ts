// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const mvs2Api = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMvs2: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/mvs2/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeMvs2', id: 'LIST' }],
        }),
        getMvs2Summary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/mvs2/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeMvs2', id: 'LIST' }],
        }),
        getMvs2ById: builder.query({
            query: (id) => `/generate/mvs2/all/api/v1?id=${id}`,
        }),
        addMvs2: builder.mutation({
            query: (newMv2) => ({
                url: '/generate/mvs2/all/api/v1',
                method: 'POST',
                body: newMv2,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs2' }],
        }),
        updateMvs2: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/mvs2/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeMvs2' }],
        }),
        deleteMvs2: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/mvs2/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeMvs2' }],
        }),
        bulkUpdateMvs2: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/mvs2/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs2' }],
        }),
        bulkDeleteMvs2: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/mvs2/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMvs2' }],
        }),
    }),
})

export const {
    useGetMvs2Query,
    useGetMvs2SummaryQuery,
    useAddMvs2Mutation,
    useUpdateMvs2Mutation,
    useDeleteMvs2Mutation,
    useBulkUpdateMvs2Mutation,
    useBulkDeleteMvs2Mutation,
    useGetMvs2ByIdQuery,
} = mvs2Api
