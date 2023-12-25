import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, DatePicker, InputNumber } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import dayjs from 'dayjs';


const UpdateGoalPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [goalDetails, setGoalDetails] = useState({
        name: "",
        targetAmount: "",
        startDate: dayjs(),
        endDate: dayjs(),
    });

    const { token, setToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const goalResponse = await invoke("find_goal_by_id", { token, goalId: parseInt(id) });

                if (goalResponse) {

                    const startDate = goalResponse.start_date ? dayjs(goalResponse.start_date) : dayjs();
                    const endDate = goalResponse.end_date ? dayjs(goalResponse.end_date) : dayjs();

                    setGoalDetails({
                        name: goalResponse.goal_name,
                        targetAmount: goalResponse.target_amount,
                        startDate: startDate,
                        endDate: endDate,
                    });

                    form.setFieldsValue({
                        name: goalResponse.goal_name,
                        targetAmount: goalResponse.target_amount,
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
            } catch (err) {


                notification.info({
                    message: "Goal not found"
                });
            }
        };
        fetchData();
    }, [form, id]);


    const onFinish = async (values) => {
        try {
            const updateGoalValue = {
                token,
                goalId: parseInt(id),
                goalName: values.name,
                targetAmount: values.targetAmount,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                currentAmount: values.current_amount
            };

            await invoke('update_goal', updateGoalValue);

            notification.success({
                message: 'Update Goal Successful',
                description: 'Goal updated successfully'
            });
            navigate("/admin/goal");
        } catch (err) {
            notification.error({
                message: 'Failed to Update Goal',
                description: 'Failed to update the goal. Please try again.'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Update Goal">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        name: goalDetails.goal_name,
                        targetAmount: goalDetails.targetAmount,
                        startDate: goalDetails.startDate,
                        endDate: goalDetails.endDate,
                    }}
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
                        label="Current Amount"
                        name="current_amount"
                        rules={[{ required: true, message: 'Please input the Current amount!' }]}
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

export default UpdateGoalPage;
