// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const testaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTesta: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/testa/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeTesta', id: 'LIST' }],
        }),
        getTestaSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/testa/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeTesta', id: 'LIST' }],
        }),
        getTestaById: builder.query({
            query: (id) => `/api/testa/v1?id=${id}`,
        }),
        addTesta: builder.mutation({
            query: (newTesta) => ({
                url: '/api/testa/v1',
                method: 'POST',
                body: newTesta,
            }),
            invalidatesTags: [{ type: 'tagTypeTesta' }],
        }),
        updateTesta: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/testa/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeTesta' }],
        }),
        deleteTesta: builder.mutation({
            query: ({ id }) => ({
                url: `/api/testa/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeTesta' }],
        }),
        bulkUpdateTesta: builder.mutation({
            query: (bulkData) => ({
                url: `/api/testa/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeTesta' }],
        }),
        bulkDeleteTesta: builder.mutation({
            query: (bulkData) => ({
                url: `/api/testa/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeTesta' }],
        }),
    }),
})

export const {
    useGetTestaQuery,
    useGetTestaSummaryQuery,
    useAddTestaMutation,
    useUpdateTestaMutation,
    useDeleteTestaMutation,
    useBulkUpdateTestaMutation,
    useBulkDeleteTestaMutation,
    useGetTestaByIdQuery,
} = testaApi
