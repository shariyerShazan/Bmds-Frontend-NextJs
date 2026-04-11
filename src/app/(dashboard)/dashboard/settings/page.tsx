"use client";

import EmployeeManagementTab from "@/components/pages/dashboard/EmployeeManagementTab";
import {useEffect} from "react"
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useLazyGetMeQuery,
  useUpdateNameMutation,
} from "@/redux/api/authApi";
import { logout, setUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/store";
import { Button, Form, Input, Modal, Tabs } from "antd";
import {
  AlertTriangle,
  KeyRound,
  Lock,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordForm] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateName, { isLoading: isUpdatingName }] = useUpdateNameMutation();
  const [changeEmail, { isLoading: isChangingEmail }] =
    useChangeEmailMutation();
  const [getMe] = useLazyGetMeQuery();

  // Edit mode states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

useEffect(() => {
  const savedTab = localStorage.getItem("settings_active_tab");

  if (savedTab === "employees" && user?.role !== "ADMIN") {
    setActiveTab("profile");
    localStorage.setItem("settings_active_tab", "profile");
  } else if (savedTab) {
    setActiveTab(savedTab);
  }
}, [user]);

  const handleTabChange = (key: string) => {
  setActiveTab(key);
  localStorage.setItem("settings_active_tab", key);
};
  
  const handlePasswordFormSubmit = async (values: PasswordFormValues) => {
    try {
      const result = await changePassword({
        prevPass: values.currentPassword,
        newPass: values.newPassword,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        passwordForm.resetFields();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to change password. Please try again.",
      );
    }
  };

  const handleNameSubmit = async (values: { fullName: string }) => {
    if (!user) return;
    const profileId = user.id;
    if (!profileId) {
      toast.error("Profile not found.");
      return;
    }

    try {
      const result = await updateName({
        id: profileId,
        role: user.role,
        fullName: values.fullName,
      }).unwrap();

      if (result.success) {
        toast.success("Name updated successfully!");
        setIsEditingName(false);
        // Refetch user data to keep Redux in sync
        const meResult = await getMe().unwrap();
        if (meResult.success) {
          dispatch(setUser(meResult.data));
        }
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update name.");
    }
  };

  const handleEmailSubmit = async (values: {
    newEmail: string;
    password: string;
  }) => {
    try {
      const result = await changeEmail({
        newEmail: values.newEmail,
        password: values.password,
      }).unwrap();

      if (result.success) {
        setIsEditingEmail(false);
        emailForm.resetFields();
        localStorage.setItem("email_changed_pending_logout", "true");
        setShowLogoutModal(true);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to change email.");
    }
  };

  const handleForceLogout = () => {
    localStorage.removeItem("email_changed_pending_logout");
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout());
    window.location.href = "/auth/login";
  };

  const displayName =
    (user?.role === "ADMIN"
      ? user?.admin?.fullName
      : user?.employee?.fullName) ||
    user?.username ||
    "—";
  const displayEmail = user?.email || "—";
  const initials =
    displayName !== "—"
      ? displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  const profileContent = (
    <div className="space-y-8">
      {/* ─── Profile Card ─── */}
      <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden transition-colors">
        {/* Decorative header band */}
        <div className="h-24 bg-gradient-to-r from-[#272877] via-[#3a3da0] to-[#5255c5] relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 sm:px-8 pb-8 -mt-12 relative">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#272877] to-[#5255c5] flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white shrink-0">
              {initials}
            </div>

            {/* Name & role tag */}
            <div className="pb-2 min-w-0">
              <h2 className="text-xl font-semibold text-white truncate">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#272877]/10 text-[#272877]">
                <ShieldCheck size={12} />{" "}
                {user?.role === "ADMIN" ? "Administrator" : "Employee"}
              </span>
            </div>
          </div>

          {/* Profile details grid */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {/* Full Name — Editable */}
            <div className="group flex items-center gap-3.5 bg-gray-50 dark:bg-[#1f1f1f] hover:bg-gray-100/80 dark:hover:bg-[#2c2c2c] rounded-xl px-4 py-3.5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#272877]/10 flex items-center justify-center shrink-0">
                <UserRound
                  size={17}
                  className="text-[#272877] dark:text-[#6e6fe4]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold transition-colors">
                  Full Name
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors">
                  {displayName}
                </p>
              </div>
              <button
                onClick={() => {
                  nameForm.setFieldsValue({
                    fullName: displayName !== "—" ? displayName : "",
                  });
                  setIsEditingName(true);
                }}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#272877] hover:bg-[#272877]/10 transition-all cursor-pointer"
                title="Edit Name"
              >
                <Pencil size={14} />
              </button>
            </div>

            {/* Email — Editable */}
            <div className="group flex items-center gap-3.5 bg-gray-50 dark:bg-[#1f1f1f] hover:bg-gray-100/80 dark:hover:bg-[#2c2c2c] rounded-xl px-4 py-3.5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#272877]/10 flex items-center justify-center shrink-0">
                <Mail
                  size={17}
                  className="text-[#272877] dark:text-[#6e6fe4]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold transition-colors">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors">
                  {displayEmail}
                </p>
              </div>
              <button
                onClick={() => {
                  emailForm.resetFields();
                  setIsEditingEmail(true);
                }}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#272877] hover:bg-[#272877]/10 transition-all cursor-pointer"
                title="Change Email"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Name Card (shown when editing) ─── */}
      {isEditingName && (
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden transition-colors">
          <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100 dark:border-[#303030] flex items-center gap-3 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center transition-colors">
              <UserRound
                size={17}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">
                Update Name
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
                Change your display name
              </p>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <Form
              form={nameForm}
              layout="vertical"
              onFinish={handleNameSubmit}
              requiredMark={true}
              className="space-y-1"
            >
              <Form.Item
                label={
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                    Full Name
                  </span>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input
                  prefix={
                    <UserRound
                      size={15}
                      className="text-gray-400 dark:text-gray-500 mr-1.5"
                    />
                  }
                  placeholder="Enter your full name"
                  className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
                />
              </Form.Item>

              <Form.Item className="!mb-0 !pt-2">
                <div className="flex gap-3">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdatingName}
                    className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] !h-11 !px-8 !rounded-xl !font-semibold !text-sm !shadow-[0_1px_2px_rgba(39,40,119,0.3)] hover:!shadow-[0_4px_12px_rgba(39,40,119,0.25)] !transition-all"
                  >
                    Save Name
                  </Button>
                  <Button
                    onClick={() => setIsEditingName(false)}
                    className="!h-11 !px-6 !rounded-xl !font-semibold !text-sm !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-gray-300 !transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      {/* ─── Change Email Card (shown when editing) ─── */}
      {isEditingEmail && (
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden transition-colors">
          <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100 dark:border-[#303030] flex items-center gap-3 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center transition-colors">
              <Mail
                size={17}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">
                Change Email
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
                Update your email address (requires password confirmation)
              </p>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleEmailSubmit}
              requiredMark={true}
              className="space-y-1"
            >
              <Form.Item
                label={
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                    New Email
                  </span>
                }
                name="newEmail"
                rules={[
                  { required: true, message: "Please enter your new email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={
                    <Mail
                      size={15}
                      className="text-gray-400 dark:text-gray-500 mr-1.5"
                    />
                  }
                  placeholder="Enter new email address"
                  className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                    Current Password
                  </span>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password for verification",
                  },
                ]}
              >
                <Input.Password
                  prefix={
                    <Lock
                      size={15}
                      className="text-gray-400 dark:text-gray-500 mr-1.5"
                    />
                  }
                  placeholder="Enter your current password"
                  className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
                />
              </Form.Item>

              <Form.Item className="!mb-0 !pt-2">
                <div className="flex gap-3">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isChangingEmail}
                    className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] !h-11 !px-8 !rounded-xl !font-semibold !text-sm !shadow-[0_1px_2px_rgba(39,40,119,0.3)] hover:!shadow-[0_4px_12px_rgba(39,40,119,0.25)] !transition-all"
                  >
                    Update Email
                  </Button>
                  <Button
                    onClick={() => setIsEditingEmail(false)}
                    className="!h-11 !px-6 !rounded-xl !font-semibold !text-sm !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-gray-300 !transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      {/* ─── Change Password Card ─── */}
      <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden transition-colors">
        {/* Card header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100 dark:border-[#303030] flex items-center gap-3 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center transition-colors">
            <KeyRound
              size={17}
              className="text-amber-600 dark:text-amber-500"
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">
              Change Password
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 sm:px-8 py-7">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordFormSubmit}
            requiredMark={true}
            className="space-y-1"
          >
            <Form.Item
              label={
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                  Current Password
                </span>
              }
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <Lock
                    size={15}
                    className="text-gray-400 dark:text-gray-500 mr-1.5"
                  />
                }
                placeholder="Enter current password"
                className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                  New Password
                </span>
              }
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={
                  <Lock
                    size={15}
                    className="text-gray-400 dark:text-gray-500 mr-1.5"
                  />
                }
                placeholder="Enter new password"
                className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors">
                  Confirm New Password
                </span>
              }
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <Lock
                    size={15}
                    className="text-gray-400 dark:text-gray-500 mr-1.5"
                  />
                }
                placeholder="Confirm new password"
                className="!py-2.5 !px-3.5 !border-gray-200 dark:!border-[#303030] dark:!bg-[#1f1f1f] dark:!text-white hover:!border-[#272877]/40 dark:hover:!border-[#6e6fe4] focus:!border-[#272877] !transition-colors"
              />
            </Form.Item>

            <Form.Item className="!mb-0 !pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={isChangingPassword}
                className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] !h-11 !px-8 !rounded-xl !font-semibold !text-sm !shadow-[0_1px_2px_rgba(39,40,119,0.3)] hover:!shadow-[0_4px_12px_rgba(39,40,119,0.25)] !transition-all"
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

  const items = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <UserRound size={16} /> My Profile
        </span>
      ),
      children: profileContent,
    },
  ];

  if (user?.role === "ADMIN") {
    items.push({
      key: "employees",
      label: (
        <span className="flex items-center gap-2">
          <UsersRound size={16} /> Employee Management
        </span>
      ),
      children: <EmployeeManagementTab />,
    });
  }

  return (
    <div className="pt-6 md:pt-2">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
          Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">
          Manage your profile and security preferences
        </p>
      </div>

<Tabs
  activeKey={activeTab}
  onChange={handleTabChange}
  items={items}
  className="settings-tabs"
/>

      {/* Email Change Caution Modal */}
      <Modal
        open={showLogoutModal}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={null}
        centered
        width={440}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verification Email Sent
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            A verification email has been sent to your new email address. Please
            check your inbox and click the link to confirm the change. You must{" "}
            <strong>log out now</strong> to avoid inconsistencies.
          </p>
          <Button
            type="primary"
            danger
            size="large"
            onClick={handleForceLogout}
            className="!h-11 !px-10 !rounded-xl !font-semibold !text-sm"
          >
            Log Out Now
          </Button>
        </div>
      </Modal>
    </div>
  );
}
