import { baseApi } from "./baseApi";

import {
  CreateReportRequest,
  GetReportsParams,
  GetReportsResponse,
  SingleReportResponse,
  UpdateReportRequest,
  UpdateReportStatusRequest,
} from "@/type/type";

// ── Endpoints ──────────────────────────────────────────

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<GetReportsResponse, GetReportsParams>({
      query: (params) => ({
        url: "/reports",
        params: {
          ...(params.page && { page: params.page }),
          ...(params.limit && { limit: params.limit }),
          ...(params.minDate && { minDate: params.minDate }),
          ...(params.maxDate && { maxDate: params.maxDate }),
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: ["Report"],
    }),

    createReport: builder.mutation<SingleReportResponse, CreateReportRequest>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report", "Product"],
    }),

    updateReport: builder.mutation<SingleReportResponse, UpdateReportRequest>({
      query: ({ id, data }) => ({
        url: `/reports/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Report", "Product"],
    }),

    updateReportStatus: builder.mutation<
      SingleReportResponse,
      UpdateReportStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/reports/change-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Report", "Product"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useUpdateReportStatusMutation,
} = reportApi;
