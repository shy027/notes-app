import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';  // 添加这行
import { searchUser, Watching } from '@/api/userApi';  // 添加 Watching API
import { useLocation, useParams,useNavigate } from 'react-router-dom';
import './SearchUsers.css';
import defaultAvatar from '@/assets/User.png';
import { message } from 'antd';  // 添加在文件顶部的导入部分

const SearchUsers = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();  // 移到顶部
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

  const handleFollowClick = async (targetUserId) => {
    try {
      // 解析当前的 watching 数组，确保是数字数组
      let currentWatching = user.watching || [];
      
      if (user.watching) {
        currentWatching = typeof user.watching === 'string' 
          ? JSON.parse(user.watching) 
          : user.watching;
      }
      
      let newWatchingList;
      const isFollowing = currentWatching.includes(targetUserId);
      if (isFollowing) {
        newWatchingList = currentWatching.filter(id => id !== targetUserId);
      } else {
        newWatchingList = [...currentWatching, targetUserId];
      }
      
      // 修改API调用参数格
      
      const response = await Watching(user.id, newWatchingList);
      
      if (response.status === 200) {
        // 更新全局状态
        // 显示操作成功提示
        message.success(isFollowing ? '取消关注成功' : '关注成功');
        
        user.watching = newWatchingList;
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify({
          ...user,
          watching: newWatchingList
        }));
        // 更新UI
        setUsers([...users]);
      }
    } catch (error) {
      console.error('关注操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

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
                  .map((searchedUser) => (
                    <div 
                      key={searchedUser.id} 
                      className="user-card"
                      onClick={() => navigate('/personal', { state: searchedUser })}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={searchedUser.avatar_url || defaultAvatar}
                        alt="用户头像"
                        className="user-avatar"
                      />
                      <h3 className="user-name">{searchedUser.nickname || searchedUser.username}</h3>
                      {searchedUser.id !== user.id && (
                        <button 
                          className={`follow-button ${user.watching?.includes(searchedUser.id) ? 'followed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowClick(searchedUser.id);
                          }}
                        >
                          {user.watching?.includes(searchedUser.id) ? '已关注' : '关注'}
                        </button>
                      )}
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
