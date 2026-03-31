import { getBaseUrl } from '@/lib/base_url';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        // Set access token from Redux state as Authorization header
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('Authorization', `${token}`);
        }

        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    tagTypes: ['Auth', 'Category', 'Brand', 'Product', 'Report'],
    endpoints: () => ({}),
});
