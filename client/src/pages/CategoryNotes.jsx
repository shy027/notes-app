/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:38:17
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-03-24 19:39:19
 * @FilePath: \notes-app\client\src\pages\CategoryNotes.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { List, Card, Tag } from 'antd';
import { getNotesByCategory } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);
      } catch (error) {
        console.error('Failed to fetch notes by category', error);
        alert('获取笔记失败');
      }
    };

    fetchNotesByCategory();
  }, [categoryId]);

  if (!notes) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <h1>分类笔记列表</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={notes}
        renderItem={(item) => (
          <Card className="bg-blue-100 m-2">
            <Card.Meta
              title={item.title}
              description={item.content.substring(0, 60) + '...'}
            />
            {item.tags && item.tags.length > 0 && (
              <div className="tags-container">
                {item.tags.map((tag) => (
                  <Tag color="cyan" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
            <a href={`/notes/${item.id}`}>查看详情</a>
          </Card>
        )}
      />
    </>
  );
};

export default CategoryNotes;
