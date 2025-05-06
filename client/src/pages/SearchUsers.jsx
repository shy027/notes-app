import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { searchUser } from '@/api/userApi';
import { useLocation, useParams,useNavigate } from 'react-router-dom';
import './SearchUsers.css';
import defaultAvatar from '@/assets/User.png';

const SearchUsers = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await searchUser(name);
        if (response && response.data) {
          const userData = Array.isArray(response.data) ? response.data : [];
          setUsers(userData);
        }
      } catch (error) {
        console.error('搜索用户失败:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [name]);

  // 可以添加一个单独的 useEffect 来监听 users 的变化
  useEffect(() => {
  }, [users]);

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#d9f6ff', minHeight: '100vh' }}>
        <div className="search-users-container">
          <div className="search-result-header">
            <p className="search-result-text">
              搜索 "<span className="search-keyword">{name}</span>" 的结果：
              {users.length > 0 ? `找到 ${users.length} 个用户` : '未找到相关用户'}
            </p>
          </div>

          {loading ? (
            <div className="loading">正在搜索...</div>
          ) : users.length > 0 ? (
            <>
              <div className="users-grid">
                {users
                  .slice((currentPage - 1) * limit, currentPage * limit)
                  .map((user) => (
                    <div 
                      key={user.id} 
                      className="user-card"
                      onClick={() => navigate('/personal', { state: user })}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={user.avatar_url || defaultAvatar}
                        alt="用户头像"
                        className="user-avatar"
                      />
                      <h3 className="user-name">{user.nickname || user.username}</h3>
                      <button 
                        className="follow-button"
                        onClick={(e) => e.stopPropagation()}  // 防止按钮点击触发卡片跳转
                      >
                        关注
                      </button>
                    </div>
                  ))}
              </div>

              <div className="pagination-container">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                  style={{
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  上一页
                </button>
                <span className="page-info">
                  第 {currentPage} 页，共 {Math.ceil(users.length / limit)} 页
                </span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * limit >= users.length}
                  style={{
                    cursor: currentPage * limit >= users.length ? 'not-allowed' : 'pointer',
                  }}
                >
                  下一页
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>未找到相关用户</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchUsers;
