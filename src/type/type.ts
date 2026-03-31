// ── Shared Types ──────────────────────────────────────────────

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ── Auth Types ────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface AdminProfile {
  id: string;
  userId: string;
  fullName: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  fullName: string;
  bloodGroup: string | null;
  gender: string | null;
  address: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  contactNo: string;
  lang: string;
  role: "ADMIN" | "EMPLOYEE";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "BLOCKED";
  dob: string | null;
  fcmToken: string;
  admin: AdminProfile | null;
  employee: EmployeeProfile | null;
  customer?: unknown;
}

export interface GetMeResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: AuthUser;
}

export interface ChangePasswordRequest {
  prevPass: string;
  newPass: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: {
    message: string;
  };
}

export interface ResetPasswordRequest {
  id: string;
  password: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: unknown;
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface ChangeEmailResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: unknown;
}

export interface UpdateNameRequest {
  id: string;
  role: "ADMIN" | "EMPLOYEE";
  fullName: string;
}

export interface UpdateNameResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: unknown;
}

export interface ResetEmailRequest {
  token: string;
}

export interface ResetEmailResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: unknown;
}

// ── Category Types ────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetCategoriesResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: Category[];
}

export interface SingleCategoryResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: Category;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  data: {
    name?: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}

// ── Brand Types ───────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface GetBrandsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetBrandsResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: Brand[];
}

export interface SingleBrandResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: Brand;
}

export interface CreateBrandRequest {
  name: string;
  description?: string;
}

export interface UpdateBrandRequest {
  id: string;
  data: {
    name?: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}

// ── Product Types ─────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  model: string;
  costPrice: number;
  salePrice: number;
  initStock: number;
  barCode: string | null;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  categoryId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetProductsResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: Product[];
}

export interface SingleProductResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: Product;
}

export interface CreateProductRequest {
  name: string;
  model: string;
  costPrice: number;
  salePrice: number;
  initStock: number;
  description?: string;
  barCode?: string;
  categoryId: string;
  brandId: string;
}

export interface UpdateProductRequest {
  id: string;
  data: {
    name?: string;
    model?: string;
    costPrice?: number;
    salePrice?: number;
    description?: string;
    barCode?: string;
    status?: "ACTIVE" | "INACTIVE";
    categoryId?: string;
    brandId?: string;
  };
}

// ── Report Types ──────────────────────────────────────────────

export interface Report {
  id: string;
  productId: string;
  employeeId: string | null;
  qty: number;
  totalCostPrice: number;
  totalSalePrice: number;
  profitLoss: number;
  type: "IN" | "OUT";
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdBy: "ADMIN" | "EMPLOYEE";
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string | null;
    description?: string;
    model: string;
    costPrice: number;
    salePrice: number;
    initStock: number;
    barCode: string | null;
    categoryId: string;
    status: "ACTIVE" | "INACTIVE";
    brandId: string;
    createdAt: string;
    updatedAt: string;
  };
  employee: EmployeeProfile | null;
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  minDate?: string;
  maxDate?: string;
  status?: "APPROVED" | "PENDING" | "REJECTED";
}

export interface GetReportsResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: Report[];
}

export interface SingleReportResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: Report;
}

export interface CreateReportRequest {
  productId: string;
  type: "IN" | "OUT";
  qty: number;
}

export interface UpdateReportRequest {
  id: string;
  data: {
    productId: string;
    type: "IN" | "OUT";
    qty: number;
  };
}

export interface UpdateReportStatusRequest {
  id: string;
  status: "APPROVED" | "REJECTED" | "DELETED";
}

// ── Analytics Types ──────────────────────────────────────────

export interface AnalyticsData {
  totalCategories: number;
  totalProducts: number;
  totalReports: number;
}

export interface AnalyticsResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: AnalyticsData;
}

// ── User / Employee Types ────────────────────────────────────

export interface GetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: "ADMIN" | "EMPLOYEE";
  status?: "ACTIVE" | "BLOCKED";
}

export interface GetUsersResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: AuthUser[];
}

export interface CreateEmployeeRequest {
  email: string;
  contactNo: string;
  password?: string;
  employee: {
    fullName: string;
    location?: string;
  };
}

export interface SingleUserResponse {
  message: string;
  success: boolean;
  meta: unknown;
  data: AuthUser;
}

export interface UpdateUserStatusRequest {
  id: string;
  status: "ACTIVE" | "BLOCKED";
}
