/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:13:29
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-31 13:40:12
 * @FilePath: \notes-app\client\src\pages\Login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEm
 */
import { Form, Input, Button, Typography,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
    const { setUser } = useStore();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            const response = await loginUser(values);
            setUser(response.data); // 设置用户信息
            message.success('登录成功');
            navigate('/'); // 跳转到主页
        } catch (error) {
            console.error('Login failed:', error);
            alert('用户名或密码错误');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-200">
            <div className="bg-white p-8 rounded-md shadow-lg w-150 mx-auto mt-20">
                <Title level={2} className="text-center mb-6">
                    登录
                </Title>
                <Form name="login_form" onFinish={onSubmit} className="space-y-12">
                    <Form.Item
                        name="username"
                        initialValue="shy"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        initialValue="123456"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="w-full py-5" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center mt-4">
                    还没有账号？
                    <a href="/register">去注册</a>
                </div>
            </div>
        </div>
    );
};

export default Login;