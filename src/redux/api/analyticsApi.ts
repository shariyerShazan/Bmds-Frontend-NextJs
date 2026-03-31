import { baseApi } from "./baseApi";

import { AnalyticsResponse } from "@/type/type";

// ── Endpoints ──────────────────────────────────────────

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => "/analytics",
      providesTags: ["Category", "Product", "Report"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
