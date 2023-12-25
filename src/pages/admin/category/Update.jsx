import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth'

const UpdateCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const { token, setToken } = useAuthStore()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await invoke("find_category_by_id", { token, categoryId: parseInt(id) });

                if (categoryResponse) {
                    const categoryName = categoryResponse.category_name;
                    setName(categoryName);


                    form.setFieldsValue({
                        name: categoryName,
                    });
                }
            } catch (err) {
                notification.info({
                    message: "Category not found"
                });
            }
        };
        fetchData();
    }, [form, id]);

    const onFinish = async (values) => {
        try {
            const updateCategoryValue = {
                token,
                categoryId: parseInt(id),
                newName: values.name,
            };

            await invoke('update_category', updateCategoryValue);

            notification.success({
                message: 'Update category successful',
                description: 'Category updated successfully'
            });
            navigate("/admin/category");
        } catch (err) {
            ale

            notification.error({
                message: 'Failed to update category',
                description: 'Failed to update category. Please try again.'
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Card title="Update Category">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        name: name
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
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

export default UpdateCategoryPage;
