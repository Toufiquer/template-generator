/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';
import { IUsers_1_000___ } from '../api/v1/Model';

export type AddUserPayload = Omit<IUsers_1_000___, 'id'> & { id?: string };
export type UpdateUserPayload = { id: string } & Partial<Omit<IUsers_1_000___, 'id'>>;
export type BulkUpdateUsersPayload = UpdateUserPayload[];
export type BulkDeleteUsersPayload = { id: string }[];

export const users_2_000___Api = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers_1_000___: builder.query<IUsers_1_000___, { page?: number; limit?: number; q?: string }>({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/template-demo/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: ['tagTypeUsers_2_000___'],
    }),

    getUsers_1_000___ById: builder.query<IUsers_1_000___, string>({
      query: id => `/dashboard/template-demo/all/api/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeUsers_2_000___', id }],
    }),

    addUsers_1_000___: builder.mutation<IUsers_1_000___, AddUserPayload>({
      query: newUserPayload => ({
        url: '/dashboard/template-demo/all/api/v1',
        method: 'POST',
        body: newUserPayload,
      }),
      invalidatesTags: (result, error, arg) => (arg.id ? [{ type: 'tagTypeUsers_2_000___', id: arg.id }] : ['tagTypeUsers_2_000___']),
    }),

    updateUsers_1_000___: builder.mutation<IUsers_1_000___, UpdateUserPayload>({
      query: ({ id, ...data }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'tagTypeUsers_2_000___', id }],
    }),

    deleteUsers_1_000___: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'tagTypeUsers_2_000___', id }],
    }),

    bulkUpdateUsers_1_000___: builder.mutation<IUsers_1_000___[] | { success: boolean; count: number }, BulkUpdateUsersPayload>({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: ['tagTypeUsers_2_000___'],
    }),

    bulkDeleteUsers_1_000___: builder.mutation<void | { success: boolean; count: number }, BulkDeleteUsersPayload>({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: ['tagTypeUsers_2_000___'],
    }),
  }),
});

export const {
  useGetUsers_1_000___Query,
  useGetUsers_1_000___ByIdQuery,
  useAddUsers_1_000___Mutation,
  useUpdateUsers_1_000___Mutation,
  useDeleteUsers_1_000___Mutation,
  useBulkUpdateUsers_1_000___Mutation,
  useBulkDeleteUsers_1_000___Mutation,
} = users_2_000___Api;

// Make sure your apiSlice is defined with tag types
// Somewhere in your apiSlice.ts (or wherever it's defined):
/*
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BaseQueryFn<
  Args = any,
  Result = unknown,
  Error = FetchBaseQueryError,
  DefinitionExtraOptions = {},
  Meta = {}
> {
  (args: Args, api: BaseQueryApi, extraOptions: DefinitionExtraOptions): MaybePromise<
    QueryReturnValue<Result, Error, Meta>
  >;
}
// ... other types like BaseQueryApi, MaybePromise, QueryReturnValue if not importing from RTK

export const apiSlice = createApi({
  reducerPath: 'api', // Or your chosen reducer path
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Your base query
  tagTypes: ['tagTypeUsers_2_000___', 'AnotherTagType', 'YetAnotherTag'], // Ensure your tag is listed
  endpoints: builder => ({
    // your other endpoints or leave empty if injecting all
  }),
});
*/
