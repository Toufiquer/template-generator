/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const booksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/dashboard/books-direct-copy/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeBooks', id: 'LIST' }],
        }),
        getBooksById: builder.query({
            query: (id) => `/dashboard/books-direct-copy/all/api/v1?id=${id}`,
        }),
        addBooks: builder.mutation({
            query: (newBooks) => ({
                url: '/dashboard/books-direct-copy/all/api/v1',
                method: 'POST',
                body: newBooks,
            }),
            invalidatesTags: [{ type: 'tagTypeBooks' }],
        }),
        updateBooks: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/dashboard/books-direct-copy/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeBooks' }],
        }),
        deleteBooks: builder.mutation({
            query: ({ id }) => ({
                url: `/dashboard/books-direct-copy/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeBooks' }],
        }),
        bulkUpdateBooks: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/books-direct-copy/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBooks' }],
        }),
        bulkDeleteBooks: builder.mutation({
            query: (bulkData) => ({
                url: `/dashboard/books-direct-copy/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBooks' }],
        }),
    }),
})

export const {
    useGetBooksQuery,
    useAddBooksMutation,
    useUpdateBooksMutation,
    useDeleteBooksMutation,
    useBulkUpdateBooksMutation,
    useBulkDeleteBooksMutation,
    useGetBooksByIdQuery,
} = booksApi
