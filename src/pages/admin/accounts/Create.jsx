import React from 'react';
import { Form, Input, Button, Card, notification, Select } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const { Option } = Select;

const CreateAccountPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore();

    const onFinish = async (values) => {
        try {
            const createAccountValue = {
                token,
                accountName: values.name,
                balance: parseFloat(values.balance),
                currency: values.currency,
            };

            await invoke('create_account', createAccountValue);

            notification.success({
                message: 'Create account Successfully',
                description: 'You have successfully created an account'
            });

            navigate("/admin/account");
        } catch (err) {

            

            console.error('Failed to create account:', err);

            notification.error({
                message: 'Failed to Create account',
                description: 'Failed to create account. Please try again'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Create Account">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Account Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the account name!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Balance"
                        name="balance"
                        rules={[{ required: true, message: 'Please input the initial balance!' }]}
                    >
                        <Input type="number" style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true, message: 'Please select the currency!' }]}
                    >
                        <Select style={{ borderRadius: '4px', height: '40px' }}>
                            <Option value="USD">USD</Option>
                            <Option value="EUR">EUR</Option>
                            <Option value="GBP">GBP</Option>
                            <Option value="JPY">JPY</Option>
                            <Option value="CAD">CAD</Option>
                            <Option value="AUD">AUD</Option>
                            <Option value="CHF">CHF</Option>
                            <Option value="CNY">CNY</Option>
                            <Option value="HKD">HKD</Option>
                            <Option value="SEK">SEK</Option>
                        </Select>
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

export default CreateAccountPage;
