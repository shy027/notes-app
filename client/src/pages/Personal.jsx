/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-05-05 20:17:19
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-05 22:08:47
 * @FilePath: \notes-app\client\src\pages\Personal.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { getUser } from '@/api/userApi';
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

  return (
    <>
      <Navbar />
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
              <button className="personal-button">
                {isOwnProfile ? '我的关注' : '他的关注'}
              </button>
            </div>
            <div className="personal-but-two">
              {isOwnProfile && (
                <button className="personal-button-setting">设置</button>
              )}
              {!isOwnProfile && (
                <button className="personal-button-like">关注</button>
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
    </>
  );
};

export default Personal;
