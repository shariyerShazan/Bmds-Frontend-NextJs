import { baseApi } from './baseApi';

import {
    CreateProductRequest,
    GetProductsParams,
    GetProductsResponse,
    SingleProductResponse,
    UpdateProductRequest
} from '@/type/type';

// ── Endpoints ──────────────────────────────────────────

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<GetProductsResponse, GetProductsParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.page !== undefined) queryParams.append('page', params.page.toString());
                if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
                if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
                if (params.status) queryParams.append('status', params.status);

                const queryString = queryParams.toString();
                return {
                    url: queryString ? `/products?${queryString}` : '/products',
                };
            },
            providesTags: ['Product'],
        }),

        getProduct: builder.query<SingleProductResponse, string>({
            query: (id) => `/products/${id}`,
            providesTags: ['Product'],
        }),

        createProduct: builder.mutation<SingleProductResponse, CreateProductRequest>({
            query: (body) => ({
                url: '/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Product'],
        }),

        updateProduct: builder.mutation<SingleProductResponse, UpdateProductRequest>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
} = productApi;
