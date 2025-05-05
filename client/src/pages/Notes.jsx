import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Pagination } from 'antd';
import { getNotes, deleteNote, updateNotePrivacy } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import './Notes.css';
import shelfImage from '@/assets/shelf.png';

const Notes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: localUser } = useStore(); // 改为正确的命名
  const user = location.state;
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUserId(user.id);
    setUserName(user.username);
    fetchNotes();
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      if (localUser?.id === user.id) {
        setNotes(fetchNotesData.data);
      } else {
        // 仅显示公开笔记
        setNotes(fetchNotesData.data.filter((note) => !note.isPrivate));
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return notes.slice(startIndex, startIndex + pageSize);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center p-6">
        <h1>{userName}的笔记列表ヾ(*´∀ ˋ*)ﾉ</h1>
        {localUser?.id === userId && (
          <Button
            className="notes-btn notes-btn-create"
            onClick={() => navigate('/create-note')}
          >
            创建笔记
          </Button>
        )}
      </div>
      <hr></hr>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={getCurrentPageData()}
        className="p-4 lists"
        renderItem={(item) => (
          <div className="note-wrapper">
            <div onClick={(e) => {
              // 如果点击的是私有公开按钮或编辑删除按钮，不跳转
              if (!e.target.closest('.privacy-indicator') && 
                  !e.target.closest('.fixed-actions')) {
                navigate(`/notes/${item.id}`);
              }
            }}>
              <Card className="notes-card" hoverable>
                <div
                  className={`privacy-indicator ${item.isPrivate ? 'private' : 'public'}`}
                  onClick={async (e) => {
                    if (localUser?.id !== userId) return;
                    e.stopPropagation();
                    try {
                      await updateNotePrivacy(item.id);
                      message.success('笔记状态修改成功');
                      fetchNotes();
                    } catch (error) {
                      message.error(
                        `修改失败: ${error.response?.data?.message || error.message}`,
                      );
                    }
                  }}
                  style={{
                    cursor: localUser?.id === userId ? 'pointer' : 'not-allowed',
                  }}
                >
                  {item.isPrivate ? '私' : '公'}
                </div>
                <Card.Meta
                  title={item.title}
                  description={item.content.substring(0, 80) + '...'}
                />
                <div className="my-1">
                  <div className="tags-container">
                    {item.tags.map((tag, index) => (
                      <Tag color="cyan" key={`${item.id}-${tag}-${index}`}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            <img src={shelfImage} alt="书架" className="shelf-image" />
            {localUser?.id === userId && (
              <div className="fixed-actions">
                <Button
                  className="notes-btn notes-btn-edit"
                  onClick={() => navigate(`/notes/edit/${item.id}`)}
                >
                  改
                </Button>
                <Button
                  className="notes-btn notes-btn-delete"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedNoteId(item.id);
                  }}
                >
                  删
                </Button>
              </div>
            )}
          </div>
        )}
      />
      <div className="flex justify-center my-4">
        <Pagination
          current={currentPage}
          total={notes.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
      <Modal
        title="确认删除"
        open={modalVisible}
        onOk={async () => {
          try {
            await deleteNote(selectedNoteId);
            message.success('笔记删除成功');
            fetchNotes();
          } catch (error) {
            console.error('Failed to delete note:', error);
            message.error('删除笔记失败');
          } finally {
            setModalVisible(false);
            setSelectedNoteId(null);
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
      >
        <p>确定要删除这条笔记吗？此操作不可恢复。</p>
      </Modal>
    </>
  );
};

export default Notes;
