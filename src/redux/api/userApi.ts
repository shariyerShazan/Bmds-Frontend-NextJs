import { baseApi } from "./baseApi";

import {
  CreateEmployeeRequest,
  GetUsersParams,
  GetUsersResponse,
  SingleUserResponse,
  UpdateUserStatusRequest,
} from "@/type/type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersParams>({
      query: (params) => ({
        url: "/users",
        params: {
          ...(params.page && { page: params.page }),
          ...(params.limit && { limit: params.limit }),
          ...(params.searchTerm && { searchTerm: params.searchTerm }),
          ...(params.role && { role: params.role }),
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: ["Auth"], // Can reuse Auth or create a 'User' tag type
    }),

    createEmployee: builder.mutation<SingleUserResponse, CreateEmployeeRequest>(
      {
        query: (body) => ({
          url: "/users/create-employee",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Auth"],
      },
    ),

    updateUserStatus: builder.mutation<
      SingleUserResponse,
      UpdateUserStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/users/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateEmployeeMutation,
  useUpdateUserStatusMutation,
} = userApi;
