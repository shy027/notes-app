// 使用 antd 组件 + uncss 编写前端无关层组件
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button, Modal } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileOutlined,
  BulbOutlined,
  SettingFilled,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation(); // 使用 useLocation 钩子获取当前路由信息

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  // 根据当前路由设置菜单选中项
  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      case '/seek':
        return ['seek'];
      case '/personal':
        return ['personal'];
      case '/setting':
        return ['setting'];
      default:
        return [];
    }
  }, [location]);

  return (
    <>
      <style jsx global>{`
        .ant-menu-item-selected {
          background: linear-gradient(
            50deg,
            rgb(11, 157, 255),
            transparent
          ) !important;
          transform: skew(-10deg);
        }
      `}</style>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, #001529, #1890ff)',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          className="custom-menu"
          style={{
            background: 'transparent',
          }}
          items={[
            {
              key: 'home',
              label: (
                <Space size="middle">
                  <HomeOutlined />
                  <span>首页</span>
                </Space>
              ),
              onClick: () => navigate('/'),
            },
            {
              key: 'categories',
              label: (
                <Space size="middle">
                  <AppstoreOutlined />
                  <span>搜索</span>
                </Space>
              ),
              onClick: () => navigate('/categories'),
            },
            {
              key: 'seek',
              label: (
                <Space size="middle">
                  <BulbOutlined />
                  <span>发现</span>
                </Space>
              ),
              onClick: () => navigate('/seek'),
            },
            {
              key: 'notes',
              label: (
                <Space size="middle">
                  <FileOutlined />
                  <span>笔记</span>
                </Space>
              ),
              onClick: () => navigate('/notes', { state: user }),
            },
            {
              key: 'personal',
              label: (
                <Space size="middle">
                  <UserOutlined />
                  <span>空间</span>
                </Space>
              ),
              onClick: () => navigate('/personal', { state: user }),
            },
            {
              key: 'setting',
              label: (
                <Space size="middle">
                  <SettingFilled />
                  <span>设置</span>
                </Space>
              ),
              onClick: () => navigate('/setting'),
            },
          ]}
        />
        <div>
          {user ? (
            <Space>
              <Space 
                onClick={() => navigate('/personal', { state: user })}
                style={{ 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {user.avatar_url ? (
                  <Avatar src={user.avatar_url} />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )}
                <Text className="ml-2 text-white">
                  {user.nickname || user.username}
                </Text>
              </Space>
              <Button 
                type="primary"
                danger
                ghost
                onClick={handleLogout}
                style={{ 
                  marginLeft: '16px',
                  borderRadius: '20px',
                  padding: '4px 16px',
                  height: '32px',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(255, 77, 79, 0.2)'
                  }
                }}
              >
                退出
              </Button>
            </Space>
          ) : (
            <Button 
              type="primary" 
              onClick={() => navigate('/login')}
              style={{
                borderRadius: '20px',
                padding: '4px 20px',
                height: '32px'
              }}
            >
              登录
            </Button>
          )}
        </div>
      </Header>
    </>
  );
};
export default Navbar;
