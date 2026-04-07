import { baseApi } from "./baseApi";

import {
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  ResetEmailRequest,
  ResetEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateNameRequest,
  UpdateNameResponse,
} from "@/type/type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/get-me",
      providesTags: ["Auth"],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { id: data?.id, password: data?.password },
        headers: {
          Authorization: data?.token!,
        },
      }),
    }),
    changeEmail: builder.mutation<ChangeEmailResponse, ChangeEmailRequest>({
      query: (data) => ({
        url: "/auth/change-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateName: builder.mutation<UpdateNameResponse, UpdateNameRequest>({
      query: ({ id, role, fullName }) => {
        const endpoint = role === "ADMIN" ? "admins" : "employees";
        const profileKey = role === "ADMIN" ? "admin" : "employee";
        const formData = new FormData();
        formData.append("data", JSON.stringify({ [profileKey]: { fullName } }));
        return {
          url: `/${endpoint}/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resetEmail: builder.mutation<ResetEmailResponse, ResetEmailRequest>({
      query: ({ token }) => ({
        url: "/auth/reset-email",
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: "",
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log(arg);
        try {
          await queryFulfilled;
          // Clear the local state cache if necessary
          dispatch(authApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangeEmailMutation,
  useUpdateNameMutation,
  useResetEmailMutation,
  useLogoutMutation,
} = authApi;
