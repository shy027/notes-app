/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:11:20
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-31 15:35:09
 * @FilePath: \notes-app\client\src\components\Navbar1.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 使用 uncss 编写的自定义导航栏组件
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';
import UserOutlined from '@ant-design/icons/UserOutlined';
import { Avatar } from 'antd';
import './Navbar.css'; // 确保正确导入 UnoCSS 文件

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('确定退出?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">首页</Link>
        </li>
        <li
          className={
            location.pathname.startsWith('/categories') ? 'active' : ''
          }
        >
          <Link to="/categories">分类</Link>
        </li>
        <li className={location.pathname.startsWith('/notes') ? 'active' : ''}>
          <Link to="/notes">笔记</Link>
        </li>
      </ul>
      <div className="user-info">
        {user ? (
          <div onClick={handleLogout}>
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} />
            ) : (
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: '#87d068' }}
              />
            )}
            <span className="nickname">{user.nickname || user.username}</span>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            登录
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
