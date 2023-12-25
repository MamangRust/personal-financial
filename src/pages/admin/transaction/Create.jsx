import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, Select } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const { Option } = Select;

const CreateTransactionPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore();
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await invoke('find_all_categories', { token });
                setCategories(categoriesResponse);

                const accountsResponse = await invoke('find_all_accounts', { token });
                setAccounts(accountsResponse);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values) => {
        try {

            const createTransactionValue = {
                token,
                accountId: parseInt(values.accountId),
                transaction_date: values.transactionDate,
                description: values.description,
                amount: parseFloat(values.amount),
                transactionType: values.transactionType,
                categoryId: parseInt(values.categoryId),
                location: values.location,
            };

            await invoke('create_transaction', createTransactionValue);

            notification.success({
                message: 'Create transaction Successfully',
                description: 'You have successfully created a transaction'
            });

            navigate("/admin/transaction");
        } catch (err) {

            console.error('Failed to create transaction:', err);

            notification.error({
                message: 'Failed to Create transaction',
                description: 'Failed to create transaction. Please try again'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Create Transaction">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Account ID"
                        name="accountId"
                        rules={[{ required: true, message: 'Please select the account ID!' }]}
                    >
                        <Select style={{ borderRadius: '4px', height: '40px' }}>
                            {accounts.map((account) => (
                                <Option key={account.account_id} value={account.account_id}>
                                    {account.account_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

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
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please input the amount!' }]}
                    >
                        <Input type="number" style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Transaction Type"
                        name="transactionType"
                        rules={[{ required: true, message: 'Please select the transaction type!' }]}
                    >
                        <Select style={{ borderRadius: '4px', height: '40px' }}>
                            <Option value="income">Income</Option>
                            <Option value="expense">Expense</Option>
                            <Option value="transfer">Transfer</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Location"
                        name="location"
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
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

export default CreateTransactionPage;
