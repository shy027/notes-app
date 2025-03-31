/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:16:07
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:17:00
 * @FilePath: \notes-app\client\src\pages\Home.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Layout, Typography } from 'antd';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        {user ? (
          <Title level={2}>欢迎，{user.nickname || user.username}</Title>
        ) : (
          <Title level={2}>欢迎来到笔记应用</Title>
        )}
        <p>这是主页。</p>
      </Content>
    </Layout>
  );
};

export default Home;
