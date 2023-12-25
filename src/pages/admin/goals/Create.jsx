import React from 'react';
import { Form, Input, Button, Card, notification, DatePicker, InputNumber } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const CreateGoalPage = () => {
    const [form] = Form.useForm();
    const {token, setToken} = useAuthStore();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
          

            const createGoalValue = {
                token,
                goalName: values.name,
                targetAmount: values.targetAmount,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
            };

            await invoke('create_goal', createGoalValue);

            notification.success({
                message: 'Create Goal Successfully',
                description: 'You have successfully created a goal.'
            });
            navigate("/admin/goal");
        } catch (err) {

            
            notification.error({
                message: 'Failed to Create Goal',
                description: 'Failed to create a goal. Please try again.'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Create Goal">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the goal name!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>
                    <Form.Item
                        label="Target Amount"
                        name="targetAmount"
                        rules={[{ required: true, message: 'Please input the target amount!' }]}
                    >
                        <InputNumber style={{ borderRadius: '4px', height: '40px' }} />
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
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateGoalPage;
