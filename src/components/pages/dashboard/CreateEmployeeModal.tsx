'use client';

import { useCreateEmployeeMutation } from '@/redux/api/userApi';
import { Button, Form, Input, Modal } from 'antd';
import { Lock, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { toast } from 'sonner';

interface CreateEmployeeModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateEmployeeModal({ open, onClose }: CreateEmployeeModalProps) {
    const [form] = Form.useForm();
    const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

    const handleSubmit = async (values: any) => {
        try {
            const body = {
                email: values.email,
                contactNo: values.contactNo,
                password: values.password,
                employee: {
                    fullName: values.fullName,
                    location: values.location,
                },
            };

            const result = await createEmployee(body).unwrap();
            if (result.success) {
                toast.success(result.message || 'Employee created successfully');
                form.resetFields();
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create employee');
        }
    };

    const inputClasses = '!py-2 !h-11 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] transition-all';
    const labelClasses = 'text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block transition-colors';

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 pt-1 border-b border-gray-100 dark:border-[#303030] mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
                        <UserRound size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Add Employee</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Create a new employee account</p>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            className="custom-modal [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:dark:!bg-[#141414] [&_.ant-modal-close]:!top-6 [&_.ant-modal-close]:!right-6"
            width={480}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="mt-2"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Form.Item
                        label={<span className={labelClasses}>Full Name</span>}
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter employee name' }]}
                        className="col-span-2"
                    >
                        <Input
                            prefix={<UserRound size={16} className="text-gray-400 mr-1.5" />}
                            placeholder="e.g. John Doe"
                            className={inputClasses}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Email Address</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email address' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                        className="col-span-2 md:col-span-1"
                    >
                        <Input
                            prefix={<Mail size={16} className="text-gray-400 mr-1.5" />}
                            placeholder="employee@example.com"
                            className={inputClasses}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Contact Number</span>}
                        name="contactNo"
                        rules={[{ required: true, message: 'Please enter contact number' }]}
                        className="col-span-2 md:col-span-1"
                    >
                        <Input
                            prefix={<Phone size={16} className="text-gray-400 mr-1.5" />}
                            placeholder="+8801XXXXXXXXX"
                            className={inputClasses}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Location / Address</span>}
                        name="location"
                        className="col-span-2"
                    >
                        <Input
                            prefix={<MapPin size={16} className="text-gray-400 mr-1.5" />}
                            placeholder="e.g. Dhaka, Bangladesh"
                            className={inputClasses}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Please set an initial password' }]}
                        className="col-span-2"
                        help={<span className="text-xs text-gray-400">Employee can change this later.</span>}
                    >
                        <Input.Password
                            prefix={<Lock size={16} className="text-gray-400 mr-1.5" />}
                            placeholder="Secure password"
                            className={inputClasses}
                        />
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-[#303030]">
                    <Button
                        onClick={onClose}
                        className="!h-11 !px-6 !rounded-xl !font-medium !text-gray-600 dark:!text-gray-300 dark:!bg-[#1f1f1f] dark:!border-[#303030] hover:dark:!bg-[#2c2c2c] transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] dark:!bg-[#6e6fe4] dark:hover:!bg-[#5c5cd6] !h-11 !px-8 !rounded-xl !font-medium shadow-md shadow-[#272877]/20 dark:shadow-[#6e6fe4]/20 !transition-all"
                    >
                        Create Employee
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
