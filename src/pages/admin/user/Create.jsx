import React from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';




const CreateUserPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();


    const onFinish = async (values) => {
        const createuser_value = {
            name: values.name,
            email: values.email,
            password: values.password,
            job: values.job,
            description: values.description
        };

        try {
            const response = await invoke('create_user', createuser_value)

            

            notification.success({
                message: 'Create User Successfully',
                description: 'You have successfully create user'
            })
            navigate("/admin/user")

        } catch (err) {
            ("Hello " + JSON.stringify(err))

            notification.error({
                message: 'Failed Create User',
                description: "Failed Create User. Please try again"
            })
        }

    };

    const onFinishFailed = (errorInfo) => {
        
        console.log('Failed:', errorInfo);
    };



    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Form Page">
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
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                        ]}
                    >
                        <Input.Password style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Job"
                        name="job"
                        rules={[{ required: true, message: 'Please input your job!' }]}
                    >
                        <Input style={{ borderRadius: '4px', height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input.TextArea style={{ borderRadius: '4px' }} />
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

export default CreateUserPage;
