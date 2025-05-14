/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:13:29
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-14 20:27:51
 * @FilePath: \notes-app\client\src\pages\Login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styles from './Login/Login.module.css'; // 添加这行导入
import { Form, Input, Button, Typography, message } from 'antd';
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
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <Title level={2} className={styles.loginTitle}>
          登录
        </Title>
        <Form
          name="login_form"
          onFinish={onSubmit}
          className={styles.loginForm}
        >
          <Form.Item
            name="username"
            initialValue="shy"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              className={styles.inputField}
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
              className={styles.inputField}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              className={styles.loginButton}
              htmlType="submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.registerLink}>
          还没有账号？
          <a href="/register">去注册</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
