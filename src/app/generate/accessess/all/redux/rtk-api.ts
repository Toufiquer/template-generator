// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const accessessApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccesses: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/dashboard/accessess/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeAccesses', id: 'LIST' }],
        }),
        getAccessesById: builder.query({
            query: (id) => `/dashboard/accessess/all/api/v1?id=${id}`,
        }),
        addAccesses: builder.mutation({
            query: (newAccess) => ({
                url: '/dashboard/accessess/all/api/v1',
                method: 'POST',
                body: newAccess,
            }),
            invalidatesTags: [{ type: 'tagTypeAccesses' }],
        }),
        updateAccesses: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/dashboard/accessess/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeAccesses' }],
        }),
        deleteAccesses: builder.mutation({
            query: ({ id }) => ({
                url: `/dashboard/accessess/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeAccesses' }],
        }),
        bulkUpdateAccesses: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/accessess/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAccesses' }],
        }),
        bulkDeleteAccesses: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/accessess/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAccesses' }],
        }),
    }),
})

export const {
    useGetAccessesQuery,
    useAddAccessesMutation,
    useUpdateAccessesMutation,
    useDeleteAccessesMutation,
    useBulkUpdateAccessesMutation,
    useBulkDeleteAccessesMutation,
    useGetAccessesByIdQuery,
} = accessessApi
