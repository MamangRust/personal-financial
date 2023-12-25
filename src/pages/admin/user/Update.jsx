import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useParams } from 'react-router-dom';




const UpdateUserPage = () => {
    const [form] = Form.useForm();
    const { id } = useParams()
    const [user, setUser] = useState({
        user_id: '',
        name: '',
        email: '',
        job: '',
        description: ''
    });


    useEffect(() => {
        const fetchData = async () => {
            
            try {
               
                const userResponse = await invoke('find_by_id_user', { id: parseInt(id) });

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
                    message: "not found find user by ID"
                });
            }
        };

        fetchData();
    }, [form]);

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

            navigate("/admin/user")
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
            <Card title="Form Page">
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

        </div>

    );
};

export default UpdateUserPage;
