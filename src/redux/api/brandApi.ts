import { baseApi } from './baseApi';

import {
    CreateBrandRequest,
    GetBrandsParams,
    GetBrandsResponse,
    SingleBrandResponse,
    UpdateBrandRequest
} from '@/type/type';

// ── Endpoints ──────────────────────────────────────────

export const brandApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBrands: builder.query<GetBrandsResponse, GetBrandsParams>({
            query: (params) => ({
                url: '/brands',
                params: {
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                    ...(params.searchTerm && { searchTerm: params.searchTerm }),
                    ...(params.status && { status: params.status }),
                },
            }),
            providesTags: ['Brand'],
        }),

        getBrand: builder.query<SingleBrandResponse, string>({
            query: (id) => `/brands/${id}`,
            providesTags: ['Brand'],
        }),

        createBrand: builder.mutation<SingleBrandResponse, CreateBrandRequest>({
            query: (body) => ({
                url: '/brands',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Brand'],
        }),

        updateBrand: builder.mutation<SingleBrandResponse, UpdateBrandRequest>({
            query: ({ id, data }) => ({
                url: `/brands/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Brand'],
        }),

        deleteBrand: builder.mutation<SingleBrandResponse, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brand'],
        }),
    }),
});

export const {
    useGetBrandsQuery,
    useGetBrandQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandApi;
