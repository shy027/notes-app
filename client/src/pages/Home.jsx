import { Layout, Typography } from 'antd';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import './Home.css';
import { useStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  // 添加动画观察器
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          } else {
            entry.target.classList.remove('animate-fade-in');
          }
        });
      },
      { 
        threshold: 0.1,  // 降低触发阈值
        rootMargin: '-20px'  // 减小边距
      }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <Navbar />
      <Content className="min-h-screen bg-white">
        {/* 添加介绍部分 */}
        <div className="relative h-[500px] bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                记录灵感，分享知识
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                一个现代化的笔记应用，让你的想法自由流动
              </p>
            </div>
          </div>
        </div>

        {/* 特性介绍部分 */}
        <div className="py-24 px-6">  {/* 增加上下内边距 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-16">  {/* 改为4列并增加间距 */}
              <div className="fade-in-section opacity-0">
                <h3 className="text-3xl font-bold mb-6 text-title">简单易用</h3>
                <p className="text-content">
                  直观的界面设计，让你专注于内容创作，轻松记录每一个想法。提供多种编辑工具，让创作过程更加流畅。
                </p>
              </div>
              <div className="fade-in-section opacity-0">
                <h3 className="text-3xl font-bold mb-6 text-title">分类管理</h3>
                <p className=" text-content">
                  强大的分类系统，帮助你有条理地组织和管理所有笔记。支持标签、文件夹等多种分类方式，让笔记井然有序。
                </p>
              </div>
              <div className="fade-in-section opacity-0">
                <h3 className="text-3xl font-bold mb-6 text-title">随时访问</h3>
                <p className="  text-content">
                  云端存储，让你的笔记随时随地可用，永不丢失。多端同步功能确保你可以在任何设备上访问和编辑笔记。
                </p>
              </div>
              <div className="fade-in-section opacity-0">
                <h3 className="text-3xl font-bold mb-6 text-title">内容共享</h3>
                <p className=" text-content">
                  支持作品共享，可以轻松地与他人分享笔记和想法。实时同步确保好友间始终保持信息同步。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 笔记列表部分 */}
        <div className="p-6 relative">
          <div className="max-w-6xl mx-auto bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 rounded-lg p-8 overflow-visible h-auto pb-25 shadow-[18px_25px_15px_-3px_rgba(30,64,175,0.45)]">
            {/* 图文展示部分内容保持不变 */}
            <div className="max-w-6xl mx-auto px-6 -my-12">
              <div className="image-section fade-in-section">
                <img
                  src="https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/3.png"
                  alt="笔记创作"
                />
                <div className="content">
                  <h3 className="text-2xl font-bold">创作你的故事</h3>
                  <p>
                    在这里，每一个想法都值得被记录。我们提供简洁而强大的编辑器，让你专注于内容创作，将灵感转化为永恒。
                  </p>
                  <a onClick={ () => navigate('/notes', { state: user })}className="inline-flex items-center mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    前往体验
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="image-section right fade-in-section">
                <img
                  src="https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/2.png"
                  alt="知识管理"
                />
                <div className="content">
                  <h3 className="text-2xl font-bold">高效的知识管理</h3>
                  <p>
                    通过标签和分类系统，轻松组织你的笔记。无论是学习笔记、工作计划还是生活感悟，都能完美归类。
                  </p>
                  <a onClick={ () => navigate('/categories')} className="inline-flex items-center mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    前往体验
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="image-section fade-in-section">
                <img
                  src="https://class-practice.oss-cn-nanjing.aliyuncs.com/notesApp/4.png"
                  alt="分享交流"
                />
                <div className="content">
                  <h3 className="text-2xl font-bold">分享与交流</h3>
                  <p>
                    知识的价值在于传播。在这里，你可以与志同道合的人分享见解，激发更多创意的火花。
                  </p>
                  <a onClick={ () => navigate('/seek')} className="inline-flex items-center mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    前往体验
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 添加页脚部分 */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-16 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              开启你的知识管理之旅，让创作更有价值
            </h2>
            <div className="grid md:grid-cols-3 gap-12 text-blue-100 text-lg">
              <div>
                <h4 className="font-semibold mb-4">联系我们</h4>
                <p>邮箱：shy@lalala.com</p>
                <p>电话：400-123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">关注我们</h4>
                <p>微信：NotesOfficial</p>
                <p>微博：@Notes官方</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">地址</h4>
                <p>南京市栖霞区</p>
                <p>南京工业职业技术大学</p>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
