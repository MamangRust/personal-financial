import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, Select } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const { Option } = Select;

const UpdateAccountPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        name: '',
        balance: '',
        currency: ''
    })
    const {token, setToken} = useAuthStore()
   
    const { id } = useParams();

    const idInt = parseInt(id)

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await invoke('find_account_by_id', { token, accountId: idInt });
                
                setAccount({
                    name: response.account_name,
                    balance: response.balance,
                    currency: response.currency,
                })

                

                form.setFieldsValue({
                    name: response.account_name,
                    balance: response.balance,
                    currency: response.currency,
                });
            } catch (error) {
                
                console.error('Failed to fetch account:', error);
            }
        };

        fetchAccount();
    }, [id, form]);

    const onFinish = async (values) => {
        try {
            const updateAccountValue = {
                token,
                accountId: idInt,
                accountName: values.name,
                balance: parseFloat(values.balance),
                currency: values.currency,
            };

            await invoke('update_account', updateAccountValue);

            notification.success({
                message: 'Update account Successfully',
                description: 'You have successfully updated the account'
            });

            navigate("/admin/account");
        } catch (err) {

            

            console.error('Failed to update account:', err);

            notification.error({
                message: 'Failed to Update account',
                description: 'Failed to update account. Please try again'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Update Account">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: account.name,
                        balance: account.balance,
                        currency: account.currency
                    }}
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
                        rules={[{ required: true, message: 'Please input the balance!' }]}
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

export default UpdateAccountPage;
