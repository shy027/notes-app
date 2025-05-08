import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin } from 'antd';
import { getNote } from '@/api/noteApi';
import { getUser } from '@/api/userApi';  // 添加这行
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import styles from './Note/Note.module.css';

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [noteAuthor, setNoteAuthor] = useState(null);  // 添加作者状态

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        console.log(fetchedNote);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (note?.user_id) {
        try {
          const response = await getUser(note.user_id);
          setNoteAuthor(response.data);
        } catch (error) {
          console.error('Failed to fetch author details:', error);
        }
      }
    };

    fetchAuthor();
  }, [note]);

  if (!note)
    return (
      <>
        <Navbar />
        <div className={styles.noteContainer}>
          <Spin size="large" />
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className={styles.noteContainer}>
        <Card className={styles.noteCard}>
          <h1 className={styles.noteTitle}>{note.title}</h1>
          <div className={styles.tagContainer}>
            {note.tags.map((tag) => (
              <Tag
                color="cyan"
                key={tag}
                style={{
                  fontSize: '1rem',
                  padding: '0.3rem 0.8rem',
                  marginRight: '1rem'
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
          <div className={styles.noteContent}>
            {note.content}
          </div>
          <div className={styles.noteInfo}>
            作者：{noteAuthor?.nickname || noteAuthor?.username || '未知'} | 
            创建时间：{new Date(note.created_at).toLocaleDateString()}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Note;
