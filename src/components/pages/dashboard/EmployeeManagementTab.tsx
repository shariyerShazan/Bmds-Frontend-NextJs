"use client";

import TablePagination from "@/components/shared/TablePagination";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/api/userApi";
import { Button, Input, Popconfirm, Switch, Tooltip } from "antd";
import { Plus, Search, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateEmployeeModal from "./CreateEmployeeModal";

export default function EmployeeManagementTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: usersResponse, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: debouncedSearch || undefined,
    role: "EMPLOYEE",
  });
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;

  const handleStatusToggle = async (userId: string, active: boolean) => {
    try {
      const newStatus = active ? "ACTIVE" : "BLOCKED";
      const result = await updateUserStatus({
        id: userId,
        status: newStatus,
      }).unwrap();
      if (result.success) {
        toast.success(`Employee has been ${newStatus.toLowerCase()}.`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update employee status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            size="large"
            placeholder="Search employees..."
            prefix={<Search className="text-gray-400" size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#141414] dark:!text-white"
            allowClear
          />
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={() => setIsCreateModalOpen(true)}
          className="!bg-[#272877] !border-none hover:!bg-[#272877]/90 !h-11 !rounded-xl !font-medium"
        >
          Add Employee
        </Button>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#303030] overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#303030]">
            <thead className="bg-gray-50 dark:bg-[#1f1f1f] transition-colors">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#303030] bg-white dark:bg-[#141414]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4" colSpan={4}>
                      <div className="h-4 bg-gray-200 dark:bg-[#303030] rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No employees found. Proceed to add a new employee.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#272877]/10 flex items-center justify-center shrink-0">
                          <UserRound
                            size={18}
                            className="text-[#272877] dark:text-[#6e6fe4]"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.employee?.fullName || user.username || "—"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {user.contactNo || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#272877]/10 text-[#272877] dark:bg-[#6e6fe4]/10 dark:text-[#6e6fe4]">
                        <ShieldCheck size={12} /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Popconfirm
                        title={`Are you sure you want to ${user.status === "ACTIVE" ? "block" : "unblock"} this employee?`}
                        onConfirm={() =>
                          handleStatusToggle(user.id, user.status !== "ACTIVE")
                        }
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                          className: "!bg-[#272877] hover:!bg-[#1e1f5e]",
                        }}
                      >
                        <Tooltip
                          title={
                            user.status === "ACTIVE"
                              ? "Active (Click to block)"
                              : "Blocked (Click to unblock)"
                          }
                        >
                          <div className="inline-block">
                            <Switch
                              checked={user.status === "ACTIVE"}
                              className={
                                user.status === "ACTIVE"
                                  ? "!bg-green-500"
                                  : "!bg-red-500"
                              }
                              size="small"
                            />
                          </div>
                        </Tooltip>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && meta && meta.total > pageSize && (
        <div className="mt-4">
          <TablePagination
            current={meta.page}
            pageSize={pageSize}
            total={meta.total}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      <CreateEmployeeModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
