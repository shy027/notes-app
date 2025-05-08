import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchNotes } from '@/api/noteApi';
import { getUser } from '@/api/userApi';  // 添加用户API导入
import dayjs from 'dayjs';  // 用于格式化日期
import Navbar from '@/components/Navbar';
import './SearchNotes.css';

const SearchNotes = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await searchNotes(name);
        // 获取每个笔记的作者信息
        const notesWithAuthor = await Promise.all(
          response.data.map(async (note) => {
            const userResponse = await getUser(note.user_id);
            return {
              ...note,
              author: userResponse.data?.nickname || userResponse.data?.username || 'Unknown',
              createTime: dayjs(note.created_at).format('YYYY-MM-DD')
            };
          })
        );
        setNotes(notesWithAuthor);
        
      } catch (error) {
        console.error('搜索笔记失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [name]);

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#d9f6ff', minHeight: '100vh' }}>
        <div className="search-results">
          <div className="search-header">
            <span>搜索"<span className="search-keyword">{name}</span>"的结果：</span>
            <span>找到 {notes.length} 条相关笔记</span>
          </div>

          {loading ? (
            <div className="loading">正在搜索...</div>
          ) : notes.length > 0 ? (
            <>
              <div className="notes-grid">
                {notes
                  .slice((currentPage - 1) * limit, currentPage * limit)
                  .map((note) => (
                  <div
                    key={note.id}
                    className="note-card"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <div className="note-content">
                      <h3 className="note-title">{note.title}</h3>
                      <p className="note-excerpt">{note.content}</p>
                      <div className="note-tags">
                        {note.tags && (
                          Array.isArray(note.tags) ? 
                            note.tags.map((tag, idx) => (
                              <span key={idx} className="note-tag">{tag}</span>
                            ))
                            : 
                            JSON.parse(note.tags.replace(/\\/g, '')).map((tag, idx) => (
                              <span key={idx} className="note-tag">{tag}</span>
                            ))
                        )}
                      </div>
                      <div className="note-meta">
                        <span>作者：{note.author}</span>
                        <span style={{ margin: '0 8px' }}>|</span>
                        <span>创建时间：{note.createTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  className="pagination-button"
                  style={{
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
                <span className="page-info m-2">
                  第 {currentPage} 页，共 {Math.ceil(notes.length / limit)} 页
                </span>
                <button
                  className="pagination-button"
                  style={{
                    cursor: currentPage * limit >= notes.length ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * limit >= notes.length}
                >
                  下一页
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>未找到相关笔记</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchNotes;
