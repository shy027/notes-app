import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { getUser, Watching } from '@/api/userApi';  // 添加 Watching API
import './Personal.css';
import Navbar from '@/components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/userStore';
import defaultAvatar from '@/assets/User.png'; // 导入默认头像
import { getNote } from '@/api/noteApi'; // 添加到文件顶部的导入部分

const Personal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: localUser } = useStore();
  const user = location.state;
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState('');
  const [showcaseNotes, setShowcaseNotes] = useState([]);
  const isOwnProfile = localUser?.id === userId;

  // 在状态声明部分添加
  const [followListVisible, setFollowListVisible] = useState(true);
  const [followingUsers, setFollowingUsers] = useState([]);
  
  // 在现有的 useEffect 中添加获取关注用户的逻辑
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUserId(user.id);
  
    const fetchData = async () => {
      try {
        const userResponse = await getUser(user.id);
        setUserInfo(userResponse.data);
  
        // 获取关注用户信息
        if (userResponse.data.watching) {
          const watchingList = typeof userResponse.data.watching === 'string'
            ? JSON.parse(userResponse.data.watching)
            : userResponse.data.watching;
        
          const usersData = await Promise.all(
            watchingList.map(id => getUser(id))
          );
          setFollowingUsers(usersData.map(response => response.data));
        }

        // 获取精选笔记
        if (
          userResponse.data.show_notes &&
          userResponse.data.show_notes.length > 0
        ) {
          const notesData = await Promise.all(
            userResponse.data.show_notes
              .slice(0, 3)
              .map((noteId) => getNote(noteId)),
          );
          setShowcaseNotes(notesData.map((response) => response.data));
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleFollowClick = async () => {
    try {
      let currentWatching = localUser.watching || [];
      
      if (localUser.watching) {
        currentWatching = typeof localUser.watching === 'string' 
          ? JSON.parse(localUser.watching) 
          : localUser.watching;
      }
      
      let newWatchingList;
      const isFollowing = currentWatching.includes(userId);
      if (isFollowing) {
        newWatchingList = currentWatching.filter(id => id !== userId);
      } else {
        newWatchingList = [...currentWatching, userId];
      }
      
      const response = await Watching(localUser.id, newWatchingList);
      
      if (response.status === 200) {
        message.success(isFollowing ? '取消关注成功' : '关注成功');
        localUser.watching = newWatchingList;
        localStorage.setItem('user', JSON.stringify({
          ...localUser,
          watching: newWatchingList
        }));
        
        // 重新获取用户数据
        const userResponse = await getUser(userId);
        setUserInfo(userResponse.data);
      }
    } catch (error) {
      console.error('关注操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  // 修改 return 部分的结构
  return (
    <>
      <Navbar />
      <div className="personal-page-layout">
        <div className="personal-container">
          <div className="personal-header">
            <div className="personal-info">
              <img
                src={userInfo.avatar_url || defaultAvatar}
                alt="用户头像"
                className="personal-avatar"
              />
              <div className="personal-details">
                <h2 className="personal-username">
                  {userInfo.nickname || userInfo.username}
                </h2>
                <div className="personal-subinfo">
                  <p className="personal-birthday">
                    生日：{userInfo.birthday || '未知'}
                  </p>
                  <p className="personal-bio">{userInfo.content}</p>
                </div>
              </div>
            </div>
            <div className="personal-actions">
              <div className="personal-but-one">
                <button
                  className="personal-button"
                  onClick={() => navigate('/notes', { state: user })}
                >
                  {isOwnProfile ? '我的笔记' : '他的笔记'}
                </button>
              </div>
              {/* 移除关注按钮，保留设置按钮 */}
              <div className="personal-but-two">
                {isOwnProfile && (
                  <button 
                    className="personal-button-setting" 
                    onClick={() => navigate('/setting')}
                  >
                    设置
                  </button>
                )}
                {!isOwnProfile && (
                  <button 
                    className={`personal-button-like ${localUser.watching?.includes(userId) ? 'followed' : ''}`}
                    onClick={handleFollowClick}
                  >
                    {localUser.watching?.includes(userId) ? '已关注' : '关注'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="personal-showcase">
            <h3 className="showcase-title">
              {isOwnProfile ? '我的精选展示' : '他的精选展示'}
            </h3>
            <div className="showcase-content">
              {showcaseNotes.length > 0 ? (
                <div className="showcase-notes">
                  {showcaseNotes.map((note) => (
                    <div
                      key={note.id}
                      className="showcase-note"
                      onClick={() => navigate(`/notes/${note.id}`)}
                    >
                      <h4>{note.title}</h4>
                      <div className="showcase-note-divider" />
                      <p>{note.content.substring(0, 50)}...</p>
                      <div className="showcase-note-divider" />
                      <div className="showcase-note-tags">
                        {note.tags &&
                          (Array.isArray(note.tags)
                            ? note.tags.map((tag, idx) => (
                                <span key={idx} className="showcase-note-tag">
                                  {tag}
                                </span>
                              ))
                            : JSON.parse(note.tags.replace(/\\/g, '')).map(
                                (tag, idx) => (
                                  <span key={idx} className="showcase-note-tag">
                                    {tag}
                                  </span>
                                ),
                              ))}
                      </div>
                      <div className="showcase-note-divider" />
                      <div className="showcase-note-meta">
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="showcase-empty">这里啥都没有</div>
              )}
            </div>
          </div>
        </div>

        {/* 添加关注列表侧边栏 */}
        <div className={`following-sidebar ${followListVisible ? '' : 'collapsed'}`}>
          <div className="following-header" onClick={() => setFollowListVisible(!followListVisible)}>
            <h3>关注列表</h3>
            <span className="toggle-icon">{followListVisible ? '▲' : '▼'}</span>
          </div>
          <div className="following-list">
            {followingUsers.map(followedUser => (
              // 在 following-item 的点击事件中修改
              <div 
                key={followedUser.id} 
                className="following-item"
                onClick={() => {
                  navigate('/personal', { state: followedUser });
                  window.location.reload(); // 添加页面刷新
                }}
              >
                <img 
                  src={followedUser.avatar_url || defaultAvatar} 
                  alt="用户头像" 
                  className="following-avatar"
                />
                <span className="following-name">
                  {followedUser.nickname || followedUser.username}
                </span>
              </div>
            ))}
            {followingUsers.length === 0 && (
              <div className="following-empty">暂无关注</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
