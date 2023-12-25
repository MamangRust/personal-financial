import { Form, Input, Button, Card, Checkbox, notification } from 'antd';
import "./style/login.css";
import { Link, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import { useAuthStore } from '../../store/auth';

const LoginPage = () => {
    const [form] = Form.useForm();
    const setToken = useAuthStore((state) => state.setToken);


    const navigate = useNavigate();

    const onFinish = async (values) => {

        const loginvalue = {
            email: values.email,
            password: values.password
        }

        try {
            const response = await invoke('login_user', loginvalue);

            console.log('Response from Tauri:', response);
            
            let token = response.token
           
            setToken(token);
            
            navigate("/admin")

            notification.info({
                message: 'Login Successful',
                description: 'You have successfully logged in!',
            });

        } catch (error) {
            console.error('Error calling Tauri:', error);
            notification.info({
                message: 'Login Failed',
                description: 'Failed to log in. Please try again.',
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="center-container">
            <Card className="login-card">
                <h1 className="login-card-title">Login</h1>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    className="login-form"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        className='login-form-item'
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Invalid email format!' },
                        ]}
                    >
                        <Input size="large" placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                        ]}
                        className='login-form-item'
                    >
                        <Input.Password size="large" placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Checkbox>Remember me</Checkbox>
                        <Link to="/forgot-password">Lost Password?</Link>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <div>
                    Not registered? <Link to="/register">Create Account</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
