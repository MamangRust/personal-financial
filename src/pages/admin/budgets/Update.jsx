import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, Select, DatePicker } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import dayjs from 'dayjs';

const { Option } = Select;

const UpdateBudgetPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore();
    const [categories, setCategories] = useState([]);
    
    const [budgetDetails, setBudgetDetails] = useState({
        categoryId: 0,
        amount: 0,
        startDate: dayjs(),
        endDate: dayjs(),
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await invoke('find_all_categories', { token });
                setCategories(categoriesResponse);

                const budgetResponse = await invoke('find_budget_by_id', { token ,budgetId: parseInt(id) });
                
                const startDate = budgetResponse.start_date ? dayjs(budgetResponse.start_date) : dayjs();
                const endDate = budgetResponse.end_date ? dayjs(budgetResponse.end_date) : dayjs();
                
                setBudgetDetails({
                    categoryId: budgetResponse.category_id,
                    amount: budgetResponse.amount,
                    startDate,
                    endDate
                });

                form.setFieldsValue(budgetResponse);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [form, id]);

    const onFinish = async (values) => {
        try {

            const updateBudgetValue = {
                token,
                budgetId: parseInt(id),
                categoryId: parseInt(values.categoryId),
                amount: parseFloat(values.amount),
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
            };

            await invoke('update_budget', updateBudgetValue);

            notification.success({
                message: 'Update budget Successfully',
                description: 'You have successfully updated the budget'
            });

            navigate("/admin/budget");
        } catch (err) {
            console.error('Failed to update budget:', err);

            notification.error({
                message: 'Failed to Update budget',
                description: 'Failed to update budget. Please try again'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Update Budget">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        categoryId: budgetDetails.categoryId,
                        amount: budgetDetails.amount,
                        startDate: budgetDetails.startDate,
                        endDate: budgetDetails.endDate
                    }}
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

export default UpdateBudgetPage;
