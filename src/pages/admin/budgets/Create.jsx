import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, Select, DatePicker } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const { Option } = Select;

const CreateBudgetPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await invoke('find_all_categories', { token });
                setCategories(categoriesResponse);

               
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values) => {
        try {
            

            const createBudgetValue = {
                token,
                categoryId: parseInt(values.categoryId),
                amount: parseFloat(values.amount),
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
            };

            await invoke('create_budget', createBudgetValue);

            notification.success({
                message: 'Create budget Successfully',
                description: 'You have successfully created a budget'
            });

            navigate("/admin/budget");
        } catch (err) {
            console.error('Failed to create budget:', err);

            notification.error({
                message: 'Failed to Create budget',
                description: 'Failed to create budget. Please try again'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Create Budget">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Category ID"
                        name="categoryId"
                        rules={[{ required: true, message: 'Please select the category ID!' }]}
                    >
                        <Select style={{ borderRadius: '4px', height: '40px' }}>
                            {categories.map((category) => (
                                <Option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please input the amount!' }]}
                    >
                        <Input type="number" style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select the start date!' }]}
                    >
                        <DatePicker style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please select the end date!' }]}
                    >
                        <DatePicker style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            size="small"
                            htmlType="submit"
                            style={{ borderRadius: '4px', height: '40px', width: 'auto' }}
                            block={false}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateBudgetPage;
