"use client";

import { useUpdateReportMutation } from "@/redux/api/reportApi";
import { Report } from "@/type/type";
import { EditOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Divider, Form, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import { toast } from "sonner";

interface EditReportModalProps {
  open: boolean;
  editingReport: Report | null;
  onClose: () => void;
}

export default function EditReportModal({
  open,
  editingReport,
  onClose,
}: EditReportModalProps) {
  const [form] = Form.useForm();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  useEffect(() => {
    if (open && editingReport) {
      form.setFieldsValue({
        qty: editingReport.qty,
      });
    }
  }, [open, editingReport, form]);

  interface ReportFormValues {
    qty: number;
  }

  const handleSubmit = async (values: ReportFormValues) => {
    if (!editingReport) return;

    try {
      const result = await updateReport({
        id: editingReport.id,
        data: {
          productId: editingReport.productId,
          type: editingReport.type,
          qty: values.qty,
        },
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Transaction updated successfully!");
      }
      onClose();
      form.resetFields();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update transaction.");
    }
  };

  const labelClasses =
    "text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block transition-colors";
  const inputClasses =
    "!py-2 !h-11 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] transition-all";

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-2 pt-1 border-b border-gray-100 dark:border-[#303030] mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
            <EditOutlined className="text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              Edit Transaction
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Correct the quantity of this transaction
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      className="custom-modal [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:dark:!bg-[#141414] [&_.ant-modal-close]:!top-6 [&_.ant-modal-close]:!right-6"
      width={440}
    >
      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-4">
        <p className="text-amber-800 dark:text-amber-400 text-sm font-medium flex items-center gap-2">
          <WarningOutlined /> Only use this to correct a quantity mistake. This
          will recalculate profit/loss and affect overall reports.
        </p>
      </div>

      {/* Product Info (read-only) */}
      <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl px-4 py-3 mb-4 border border-gray-100 dark:border-[#303030]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
              Product
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {editingReport?.product?.name || "—"}
            </div>
            {editingReport?.product?.model && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Model: {editingReport.product.model}
              </div>
            )}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              editingReport?.type === "IN"
                ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
            }`}
          >
            {editingReport?.type === "IN" ? "↓ IN" : "↑ OUT"}
          </span>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Quantity */}
        <Form.Item
          label={<span className={labelClasses}>Quantity</span>}
          name="qty"
          rules={[
            { required: true, message: "Please enter the corrected quantity" },
          ]}
        >
          <InputNumber
            placeholder="e.g. 5"
            min={0}
            className={`${inputClasses} !w-full`}
          />
        </Form.Item>

        <Divider className="my-4 dark:border-[#303030]" />

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!h-11 !px-6 !rounded-xl !font-medium !text-gray-600 dark:!text-gray-300 dark:!bg-[#1f1f1f] dark:!border-[#303030] hover:dark:!bg-[#2c2c2c] transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] dark:!bg-[#6e6fe4] dark:hover:!bg-[#5c5cd6] !h-11 !px-8 !rounded-xl !font-medium shadow-md shadow-[#272877]/20 dark:shadow-[#6e6fe4]/20 !transition-all"
          >
            Update Transaction
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
