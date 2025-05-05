import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getRandNotes } from '@/api/noteApi';
import {getUser} from '@/api/userApi';
import Navbar from '@/components/Navbar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Seek.css';
import leftArrow from '@/assets/left.png';
import rightArrow from '@/assets/right.png';

const Seek = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authors, setAuthors] = useState({});
  const [isCarouselReady, setIsCarouselReady] = useState(false);  // 添加轮播图状态

  const carouselImages = [
    'https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/1ff15.jpg',
    'https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/2ff15.jpg',
    'https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/p.jpg'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <div className="slick-arrow"><img src={rightArrow} alt="next" /></div>,
    prevArrow: <div className="slick-arrow"><img src={leftArrow} alt="prev" /></div>,
  };

  const fetchAuthorInfo = async (userId) => {
    try {
      const response = await getUser(userId);
      setAuthors(prev => ({
        ...prev,
        [userId]: response.data.username
      }));
    } catch (error) {
      console.error('获取作者信息失败:', error);
    }
  };

  const fetchRandomNotes = async () => {
    setIsLoading(true);
    try {
      const response = await getRandNotes();
      setNotes(response.data);
      // 获取所有笔记作者的信息
      response.data.forEach(note => {
        if (note.user_id) {
          fetchAuthorInfo(note.user_id);
        }
      });
    } catch (error) {
      console.error('获取随机笔记失败:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // 预加载轮播图
    Promise.all(
      carouselImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
        });
      })
    ).then(() => {
      setIsCarouselReady(true);
    });

    // 获取笔记数据
    fetchRandomNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="seek-container">
        <div className="carousel-container">
          {isCarouselReady && (
            <Slider {...sliderSettings} className="carousel-slide">
              {carouselImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`slide-${index + 1}`} />
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className="seek-notes-container">
          <div className="seek-content">
            <h2 className="seek-title">看看大家都写了什么</h2>
            <div className="seek-notes">
              {notes.slice(0, 9).map((note, index) => (
                <div 
                  key={note.id} 
                  className="seek-card"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    '--card-index': index  /* 添加索引变量 */
                  }}
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <h3>{note.title}</h3>
                  <div className="seek-divider"></div>
                  <p>{note.content.substring(0, 100)}...</p>
                  <div className="seek-divider"></div>
                  <div className="seek-meta">
                    <span className="seek-author">
                      作者：{authors[note.user_id] || '匿名'}
                    </span>
                    <span className="seek-date">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="seek-divider"></div>
                  <div className="seek-tags">
                    {note.tags && (
                      Array.isArray(note.tags) ? 
                        note.tags.map((tag, idx) => (
                          <span key={idx} className="seek-tag">{tag}</span>
                        ))
                        : 
                        JSON.parse(note.tags.replace(/\\/g, '')).map((tag, idx) => (
                          <span key={idx} className="seek-tag">{tag}</span>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="refresh-button"
              onClick={fetchRandomNotes}
              disabled={isLoading}
            >
              换一换
            </button>
            <button 
              className="refresh-button bottom"
              onClick={fetchRandomNotes}
              disabled={isLoading}
            >
              换一换
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Seek;
