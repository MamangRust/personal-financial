import React from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';




const CreateCategoryPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {token, setToken} = useAuthStore();


    const onFinish = async (values) => {
        
        try {
            
            const createcategory_value = {
                token,    
                categoryName: values.name,
                
            };
    

            await invoke('create_category', createcategory_value)

            

            notification.success({
                message: 'Create category Successfully',
                description: 'You have successfully create category'
            })
            navigate("/admin/category")

        } catch (err) {
            

            notification.error({
                message: 'Failed Create category',
                description: "Failed Create category. Please try again"
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

export default CreateCategoryPage;
