/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:38:17
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-07 16:16:39
 * @FilePath: \notes-app\client\src\pages\CategoryNotes.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import { getNotesByCategory, getAllNotesByCategory } from '@/api/noteApi';
import { getUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import dayjs from 'dayjs';
import './CategoryNotes.css';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 新增：视图模式
  const [currentPage, setCurrentPage] = useState(1); // 新增：当前页
  const limit = 6; // 每页显示数量

  // 删除第一个 useEffect 中的 fetchNotesByCategory
  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let fetchedNotes;

      if (viewMode === 'self') {
        fetchedNotes = await getNotesByCategory(user.id, categoryId);
      } else {
        fetchedNotes = await getAllNotesByCategory(categoryId);
      }

      if (!fetchedNotes || !fetchedNotes.data) {
        throw new Error('No data received from server');
      }

      const notesWithAuthor = await Promise.all(
        fetchedNotes.data.map(async (note) => {
          try {
            const userResponse = await getUser(note.user_id);
            return {
              ...note,
              author:
                userResponse.data?.nickname ||
                userResponse.data?.username ||
                'Unknown',
              createTime: dayjs(note.created_at).format('YYYY-MM-DD'),
            };
          } catch (error) {
            console.error(`Failed to fetch user for note ${note.id}`, error);
            return {
              ...note,
              author: 'Unknown',
              createTime: dayjs(note.created_at).format('YYYY-MM-DD'),
            };
          }
        }),
      );

      setNotes(notesWithAuthor);
    } catch (error) {
      console.error('获取分类笔记失败', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (categoryId) {
      fetchNotes();
    }
  }, [categoryId, viewMode, user]); // 添加 user 依赖

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <>
      <Navbar />
      <div className="categorynotes-container">
        <div className="categorynotes-header">
          <div className="categorynotes-toggle">
            <button
              className={`categorynotes-toggle-btn ${viewMode === 'self' ? 'active' : ''}`}
              onClick={() => setViewMode('self')}
            >
              我的笔记
            </button>
            <button
              className={`categorynotes-toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              所有笔记
            </button>
          </div>
          <h1 className="categorynotes-title">分类笔记列表</h1>
        </div>

        {loading ? (
          <div className="categorynotes-loading">正在加载...</div>
        ) : (
          <>
            <div className="categorynotes-grid">
              {notes
                .slice((currentPage - 1) * limit, currentPage * limit)
                .map((note) => (
                  <div
                    key={note.id}
                    className="categorynotes-card"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <h3 className="categorynotes-card-title">{note.title}</h3>
                    <p className="categorynotes-card-content">{note.content}</p>
                    <div className="categorynotes-card-tags">
                      {note.tags &&
                        (Array.isArray(note.tags)
                          ? note.tags.map((tag, index) => (
                              <Tag color="blue" key={index}>
                                {tag}
                              </Tag>
                            ))
                          : note.tags
                              .replace(/\\/g, '')
                              .replace(/^\"|\"$/g, '')
                              .split(',')
                              .map((tag, index) => (
                                <Tag color="blue" key={index}>
                                  {tag.trim()}
                                </Tag>
                              )))}
                    </div>
                    <div className="categorynotes-card-meta">
                      <span>作者：{note.author}</span>
                      <span>创建时间：{note.createTime}</span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="categorynotes-pagination">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <span>
                第 {currentPage} 页，共 {Math.ceil(notes.length / limit)} 页
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage * limit >= notes.length}
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};



export default CategoryNotes;
