import styles from './Register/Register.module.css';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { registerUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
    const { setUser } = useStore();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await registerUser(values);
            setUser(response.data); // 设置用户信息
            alert('注册成功');
            navigate('/login'); // 跳转到登录页面
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <Title level={2} className={styles.registerTitle}>
                    注册
                </Title>
                <Form onFinish={onFinish} className={styles.registerForm}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名"
                            className={styles.inputField}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: '请输入邮箱！' }]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="邮箱"
                            className={styles.inputField}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            className={styles.inputField}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.registerButton}
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.loginLink}>
                    已经有账号？
                    <a href="/login">去登录</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
