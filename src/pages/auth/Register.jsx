import { Form, Input, Button, Card, notification } from 'antd';
import './style/register.css';
import { Link, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const validateToNextPassword = async (_, value) => {
    if (value) {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);

      if (!(hasUpperCase && hasLowerCase && hasDigit && value.length >= 8)) {
        return Promise.reject(
          new Error(
            'Password must contain at least 8 characters, including uppercase, lowercase, and a number.'
          )
        );
      }
    }
    return Promise.resolve();
  };

  const compareToFirstPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
  });

  const onFinish = async (values) => {
    const registervalue = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    
   
    try {
      const response = await invoke('register_user', registervalue);
  
      console.log('Received values:', values);
      console.log('Response from registration:', response);

      navigate("/")
      
      notification.success({
        message: 'Registration Successful',
        description: 'You have successfully registered!',
      });
    } catch (err) {
      console.error('Registration error:', err);

      notification.error({
        message: 'Registration Failed',
        description: 'Failed to register. Please try again.',
      });
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="center-container">
      <Card className="register-card">
        <h1 className="register-card-title">Register</h1>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="register-form"
        >
          <Form.Item
            label="Name"
            name="name"
            className="register-form-item"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input size="large" placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            className="register-form-item"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input size="large" type='email' placeholder="Enter your Email" />
          </Form.Item>


          <Form.Item
            label="Password"
            name="password"
            className="register-form-item"
            rules={[
              { required: true, message: 'Please input your password!' },
              { validator: validateToNextPassword },
            ]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            className="register-form-item"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              compareToFirstPassword,
            ]}
          >
            <Input.Password size="large" placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div>
          Already have an account? <Link to="/">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
