"use client";

import TablePagination from "@/components/shared/TablePagination";
import { getBaseUrl } from "@/lib/base_url";
import {
  useGetReportsQuery,
  useUpdateReportStatusMutation,
} from "@/redux/api/reportApi";
import { RootState } from "@/redux/store";
import { Report } from "@/type/type";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Tabs } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type RangeTab = "weekly" | "monthly" | "all";
type StatusTab = "APPROVED" | "PENDING" | "REJECTED";

function getDateRange(
  tab: RangeTab,
): { minDate: string; maxDate: string } | null {
  if (tab === "all") return null;

  const now = new Date();
  const maxDate = now.toISOString();

  if (tab === "weekly") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return { minDate: weekAgo.toISOString(), maxDate };
  } else {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return { minDate: monthAgo.toISOString(), maxDate };
  }
}

export default function ReportsPage() {
  const [activeRangeTab, setActiveRangeTab] = useState<RangeTab>("weekly");
  const [activeStatusTab, setActiveStatusTab] = useState<StatusTab>("APPROVED");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);

  const dateRange = useMemo(
    () => getDateRange(activeRangeTab),
    [activeRangeTab],
  );

  const { data: reportsResponse, isLoading } = useGetReportsQuery({
    page: currentPage,
    limit: pageSize,
    ...(activeStatusTab === "APPROVED" &&
      dateRange && {
        minDate: dateRange.minDate,
        maxDate: dateRange.maxDate,
      }),
    status: activeStatusTab,
  });

  const reports = reportsResponse?.data ?? [];
  const meta = reportsResponse?.meta;

  const handleRangeTabChange = (tab: RangeTab) => {
    setActiveRangeTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [updateReportStatus] = useUpdateReportStatusMutation();

  const handleApprove = async (id: string) => {
    try {
      const result = await updateReportStatus({
        id,
        status: "APPROVED",
      }).unwrap();
      if (result.success) {
        toast.success("Report approved successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve report.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await updateReportStatus({
        id,
        status: "REJECTED",
      }).unwrap();
      if (result.success) {
        toast.success("Report rejected.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject report.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await updateReportStatus({
        id,
        status: "DELETED",
      }).unwrap();
      if (result.success) {
        toast.success("Report deleted successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete report.");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!meta || meta.total === 0) {
      toast.error("No data to export.");
      return;
    }

    setIsDownloading(true);
    try {
      const XLSX = await import("xlsx");

      // Fetch ALL pages for the date range (APPROVED only)
      const allReports: Report[] = [];
      const totalPages = Math.ceil(meta.total / 100);
      const baseUrl = getBaseUrl();

      for (let page = 1; page <= totalPages; page++) {
        const params = new URLSearchParams({
          page: String(page),
          limit: "100",
          ...(dateRange && {
            minDate: dateRange.minDate,
            maxDate: dateRange.maxDate,
          }),
          status: "APPROVED",
        });

        const res = await fetch(`${baseUrl}/reports?${params}`, {
          credentials: "include",
          headers: {
            ...(accessToken ? { Authorization: accessToken } : {}),
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          allReports.push(...json.data);
        }
      }

      if (allReports.length === 0) {
        toast.error("No data to export.");
        setIsDownloading(false);
        return;
      }

      const excelData = allReports.map((r: Report, index: number) => ({
        "#": index + 1,
        Product: r.product?.name || r.productId,
        Model: r.product?.model || "",
        "Product ID": r.productId,
        Type: r.type,
        Qty: r.qty,
        "Total Cost Price": r.totalCostPrice,
        "Total Sale Price": r.totalSalePrice,
        "Profit / Loss": r.profitLoss,
        "Created By": r.createdBy,
        Employee: r.employee?.fullName || "—",
        Date: new Date(r.createdAt).toLocaleString("en-US"),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      const sheetName =
        activeRangeTab === "weekly"
          ? "Weekly Report"
          : activeRangeTab === "monthly"
            ? "Monthly Report"
            : "All Reports";
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Auto-size columns
      const colWidths = Object.keys(excelData[0]).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...excelData.map(
              (row: Record<string, unknown>) => String(row[key]).length,
            ),
          ) + 2,
      }));
      worksheet["!cols"] = colWidths;

      const fileName = `stock_report_${activeRangeTab}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success(
        `${sheetName} downloaded successfully! (${allReports.length} records)`,
      );
    } catch {
      toast.error("Failed to generate Excel file.");
    } finally {
      setIsDownloading(false);
    }
  }, [meta, dateRange, activeRangeTab, accessToken]);

  // Build status tabs
  const statusTabs = [
    {
      key: "APPROVED",
      label: (
        <span className="flex items-center gap-2">
          <CheckCircleOutlined /> Approved
        </span>
      ),
    },
  ];

  if (user?.role === "ADMIN") {
    statusTabs.push(
      {
        key: "PENDING",
        label: (
          <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <ClockCircleOutlined /> Pending Approvals
          </span>
        ),
      },
      {
        key: "REJECTED",
        label: (
          <span className="flex items-center gap-2 text-red-500 dark:text-red-400">
            <CloseCircleOutlined /> Rejected
          </span>
        ),
      },
    );
  }

  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 transition-colors">
      <div className="pt-6 md:pt-2">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                Transaction Reports
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">
                View and download stock transaction reports
              </p>
            </div>
            {activeStatusTab === "APPROVED" && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                loading={isDownloading}
                disabled={!meta || meta.total === 0}
                className="!bg-[#272877] !border-none hover:!bg-[#272877]/90 !h-10 !rounded-lg !font-medium"
              >
                Download{" "}
                {activeRangeTab === "weekly"
                  ? "Weekly"
                  : activeRangeTab === "monthly"
                    ? "Monthly"
                    : "All"}{" "}
                Report
              </Button>
            )}
          </div>

          {/* Date Range Tabs — only for Approved */}
          {activeStatusTab === "APPROVED" && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleRangeTabChange("all")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeRangeTab === "all"
                    ? "bg-[#272877] text-white shadow-md"
                    : "bg-white dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#303030] hover:bg-gray-50 dark:hover:bg-[#252525]"
                }`}
              >
                <UnorderedListOutlined />
                All
              </button>
              <button
                onClick={() => handleRangeTabChange("weekly")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeRangeTab === "weekly"
                    ? "bg-[#272877] text-white shadow-md"
                    : "bg-white dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#303030] hover:bg-gray-50 dark:hover:bg-[#252525]"
                }`}
              >
                <CalendarOutlined />
                Weekly
              </button>
              <button
                onClick={() => handleRangeTabChange("monthly")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeRangeTab === "monthly"
                    ? "bg-[#272877] text-white shadow-md"
                    : "bg-white dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#303030] hover:bg-gray-50 dark:hover:bg-[#252525]"
                }`}
              >
                <CalendarOutlined />
                Monthly
              </button>
            </div>
          )}
        </div>

        {/* Status Tabs */}
        <Tabs
          activeKey={activeStatusTab}
          onChange={(k) => {
            setActiveStatusTab(k as StatusTab);
            setCurrentPage(1);
          }}
          className="mb-4"
          items={statusTabs}
        />

        {/* Table */}
        <div className="bg-white dark:bg-[#141414] rounded-lg shadow-sm border border-gray-200 dark:border-[#303030] overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-4xl xl:min-w-full divide-y divide-gray-200 dark:divide-[#303030]">
              <thead className="bg-gray-50 dark:bg-[#1f1f1f] transition-colors">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                    Total Sale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                    Profit / Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-[#141414] divide-y divide-gray-200 dark:divide-[#303030] transition-colors">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-[#303030] rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : reports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                      >
                        {/* Product */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors">
                            {report.product?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                            {report.product?.model || ""}
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              report.type === "IN"
                                ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {report.type === "IN" ? "↓ IN" : "↑ OUT"}
                          </span>
                        </td>

                        {/* Qty */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                          {report.qty}
                        </td>

                        {/* Total Cost */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                          {formatCurrency(report.totalCostPrice)}
                        </td>

                        {/* Total Sale */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                          {report.totalSalePrice > 0
                            ? formatCurrency(report.totalSalePrice)
                            : "—"}
                        </td>

                        {/* Profit/Loss */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors">
                          <span
                            className={
                              report.profitLoss > 0
                                ? "text-green-600 dark:text-green-400"
                                : report.profitLoss < 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-400 dark:text-gray-500"
                            }
                          >
                            {report.profitLoss !== 0
                              ? formatCurrency(report.profitLoss)
                              : "—"}
                          </span>
                        </td>

                        {/* Created By */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                                report.createdBy === "ADMIN"
                                  ? "bg-[#272877]/10 text-[#272877] dark:bg-[#6e6fe4]/10 dark:text-[#6e6fe4]"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                              }`}
                            >
                              {report.createdBy}
                            </span>
                            {report.employee && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {report.employee.fullName}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                          {formatDate(report.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            {activeStatusTab === "PENDING" && (
                              <>
                                <Popconfirm
                                  title="Approve this report?"
                                  description="This will reflect the stock changes."
                                  onConfirm={() => handleApprove(report.id)}
                                  okText="Approve"
                                  cancelText="Cancel"
                                  okButtonProps={{
                                    className:
                                      "!bg-green-600 hover:!bg-green-700 !border-none",
                                  }}
                                >
                                  <Button
                                    type="text"
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    className="!text-green-600 hover:!text-green-700"
                                    title="Approve"
                                  />
                                </Popconfirm>
                                <Popconfirm
                                  title="Reject this report?"
                                  description="The stock will not be affected."
                                  onConfirm={() => handleReject(report.id)}
                                  okText="Reject"
                                  cancelText="Cancel"
                                  okButtonProps={{
                                    className:
                                      "!bg-red-600 hover:!bg-red-700 !border-none",
                                  }}
                                >
                                  <Button
                                    type="text"
                                    icon={<CloseCircleOutlined />}
                                    size="small"
                                    className="!text-red-500 hover:!text-red-600"
                                    title="Reject"
                                  />
                                </Popconfirm>
                              </>
                            )}
                            <Popconfirm
                              title="Delete this report?"
                              description="This report will be permanently deleted."
                              onConfirm={() => handleDelete(report.id)}
                              okText="Delete"
                              cancelText="Cancel"
                              okButtonProps={{
                                className:
                                  "!bg-red-600 hover:!bg-red-700 !border-none",
                              }}
                            >
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                className="!text-red-500 hover:!text-red-600"
                                title="Delete"
                              />
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!isLoading && reports.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2 transition-colors">
                {activeStatusTab === "PENDING"
                  ? "No pending reports"
                  : activeStatusTab === "REJECTED"
                    ? "No rejected reports"
                    : "No transactions found"}
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                {activeStatusTab === "PENDING"
                  ? "All employee reports have been reviewed"
                  : activeStatusTab === "REJECTED"
                    ? "No reports have been rejected"
                    : activeRangeTab === "all"
                      ? "No transactions to display"
                      : `No ${activeRangeTab} transactions to display`}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && meta && meta.total > pageSize && (
          <div className="mt-6">
            <TablePagination
              current={meta.page}
              pageSize={pageSize}
              total={meta.total}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
