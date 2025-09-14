// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const news1esApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNews1es: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/news1es/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeNews1es', id: 'LIST' }],
        }),
        getNews1esById: builder.query({
            query: (id) => `/generate/news1es/all/api/v1?id=${id}`,
        }),
        addNews1es: builder.mutation({
            query: (newNews1) => ({
                url: '/generate/news1es/all/api/v1',
                method: 'POST',
                body: newNews1,
            }),
            invalidatesTags: [{ type: 'tagTypeNews1es' }],
        }),
        updateNews1es: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/news1es/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeNews1es' }],
        }),
        deleteNews1es: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/news1es/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeNews1es' }],
        }),
        bulkUpdateNews1es: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/news1es/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeNews1es' }],
        }),
        bulkDeleteNews1es: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/news1es/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeNews1es' }],
        }),
    }),
})

export const {
    useGetNews1esQuery,
    useAddNews1esMutation,
    useUpdateNews1esMutation,
    useDeleteNews1esMutation,
    useBulkUpdateNews1esMutation,
    useBulkDeleteNews1esMutation,
    useGetNews1esByIdQuery,
} = news1esApi
