/*
 * @Author: shy 1533103845@qq.com
 * @Date: 2025-03-24 19:35:35
 * @LastEditors: shy 1533103845@qq.com
 * @LastEditTime: 2025-05-02 22:34:16
 * @FilePath: \notes-app\client\src\pages\Categories.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import searchIcon from '@/assets/search.png';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [searchType, setSearchType] = useState('notes');
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 添加分页状态

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };

    fetchCategoriesData();
  }, []);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    if (searchType === 'notes') {
      navigate(`/notes/search/${searchText}`);
    } else {
      // 用户搜索功能待实现
      console.log('搜索用户:', searchText);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#d9f6ff', minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 搜索部分 */}
          <div className="search-container">
            <div className="flex items-center gap-4">
              <div className="search-type-button">
                <div
                  className={`type-option ${searchType === 'notes' ? 'active' : ''}`}
                  onClick={() => setSearchType('notes')}
                >
                  笔记
                </div>
                <div className="divider"></div>
                <div
                  className={`type-option ${searchType === 'users' ? 'active' : ''}`}
                  onClick={() => setSearchType('users')}
                >
                  用户
                </div>
              </div>
              <div className="search-input-container flex-1">
                <input
                  type="text"
                  className="search-input"
                  placeholder={
                    searchType === 'notes' ? '搜索笔记...' : '搜索用户...'
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="search-button" onClick={handleSearch}>
                  <img src={searchIcon} alt="搜索" className="search-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* 分类列表部分 */}
          <div className="categories-section">
            <h1 className="text-2xl font-bold mb-6">分类列表</h1>
            <List
              grid={{ gutter: 24, column: 4 }}
              dataSource={categories.slice(
                (currentPage - 1) * 8,
                currentPage * 8,
              )}
              renderItem={(item) => (
                <Card
                  hoverable
                  className="category-item"
                  style={{ minHeight: '120px', margin: '10px', width: '250px' }}
                >
                <a href={`/notes/categories/${item.id}`}>
                  <Card.Meta
                    title={item.name}
                    style={{ marginBottom: '12px' }}
                  />
                  <p>查看分类笔记</p>
                  </a>
                </Card>
              )}
            />

            {/* 分页按钮 */}
            <div className="flex justify-center mt-8 space-x-2">
              <button
                className="categories-pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              <button
                className="categories-pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * 8 >= categories.length}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
