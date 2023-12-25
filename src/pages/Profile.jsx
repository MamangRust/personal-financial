import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Image, notification } from 'antd';
import { useAuthStore } from '../store/auth';
import { invoke } from '@tauri-apps/api';




const ProfilePage = () => {
    const { token, setToken } = useAuthStore();
    const [user, setUser] = useState({
        user_id: '',
        name: '',
        email: '',
        job: '',
        description: ''
    });

    const [form] = Form.useForm();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await invoke('verify_token', { token });
                const userResponse = await invoke('find_by_id_user', { id: response });

                if (userResponse) {
                    setUser({
                        user_id: userResponse.user_id,
                        email: userResponse.email,
                        name: userResponse.name,
                        job: userResponse.job,
                        description: userResponse.description,
                    });


                    form.setFieldsValue({
                        name: userResponse.name,
                        email: userResponse.email,
                        password: userResponse.password,
                        job: userResponse.job,
                        description: userResponse.description,
                    });
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                notification.info({
                    message: "Failed to verify token or find user by ID"
                });
            }
        };

        fetchData();
    }, [token, form]);


    const onFinish = async (values) => {
        try {
            const updateProfile = {
                userId: user.user_id,
                name: values.name,
                email: values.email,
                password: values.password,
                job: values.job,
                description: values.description,
            };

           

            await invoke('update_user', updateProfile);
            notification.success({
                message: "User profile updated successfully"
            });
        } catch (error) {

            notification.error({
                message: "Failed to update user profile"
            });
            console.error(error);
        }
    };


    const onFinishFailed = (errorInfo) => {
        
        console.log('Failed:', errorInfo);
    };



    return (
        <div style={{ marginBottom: '24px' }}>
            <Row gutter={24}>
                <Col span={12}>
                    <Card title="Profile Form">
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                name: user.name,
                                email: user.email,
                                job: user.job,
                                description: user.description,
                            }}
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
                </Col>

                <Col span={12}>
                    <Card title="Submitted Profile">
                        <div style={{ textAlign: 'center' }}>

                            <Image
                                width={200}
                                src="https://via.placeholder.com/200"
                                alt="Sample Image"
                                style={{ marginBottom: '10px' }}
                            />
                            <div>
                                <p><strong>Id:</strong> {user.user_id}</p>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Jobs:</strong> {user.job}</p>
                                <p><strong>Description:</strong> {user.description}</p>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>

    );
};

export default ProfilePage;
