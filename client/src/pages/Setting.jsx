import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Checkbox, message, Modal, Pagination, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { updateUser } from '@/api/userApi';
import { getNotes } from '@/api/noteApi';
import Navbar from '@/components/Navbar';
import styles from './Setting/Setting.module.css';
import dayjs from 'dayjs'; // Replace moment with dayjs
import { getUser } from '@/api/userApi';  // 添加这行导入
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();  // 添加这行
  const { user, setUser } = useStore();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);  // 先设置为空数组
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 获取笔记列表
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes(user.id);  // 直接传入 userId
        console.log('笔记响应:', response);  // 添加日志查看返回数据
        setNotes(response.data);
        setTotal(response.data.length);  // 使用数组长度作为总数
        if (user?.show_notes?.length > 0) {
            setSelectedNotes(user.show_notes);
          }
      } catch (error) {
        console.error('获取笔记失败:', error);
        message.error('获取笔记列表失败');
      }
    };

    if (user?.id) {  // 确保用户已登录
      fetchNotes();
    }
  }, [user?.id]);  // 只依赖用户ID变化

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        nickname: user.nickname,
        password: user.password,
        content: user.content,
        birthday: user.birthday ? dayjs(user.birthday) : null, // Use dayjs instead of moment
      });
      setSelectedNotes(user.watching || []);
    }
  }, [user, form]);

  // 处理笔记选择
  const handleNoteSelect = async (noteId, checked) => {
    if (checked && selectedNotes.length >= 3) {
      message.warning('最多只能选择三个笔记展示');
      return;
    }

    const selectedNote = notes.find(note => note.id === noteId);
    if (checked && selectedNote.isPrivate === 1) {
      Modal.confirm({
        title: '提示',
        content: '所选笔记包含私有内容，是否继续展示？',
        onOk: () => {
          setSelectedNotes(prev => checked ? [...prev, noteId] : prev.filter(id => id !== noteId));
        }
      });
    } else {
      setSelectedNotes(prev => checked ? [...prev, noteId] : prev.filter(id => id !== noteId));
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      const userData = {
        ...user,
        nickname: values.nickname,
        content: values.content,
        birthday: values.birthday?.format('YYYY-MM-DD'),
        show_notes: selectedNotes,
        id: user.id,
        password: values.newPassword || user.password,  // 如果没有新密码就使用原密码
        avatar: user.avatar  // 保持原头像
      };
  
      // 如果没有修改密码，删除新密码相关字段
      if (!values.newPassword) {
        delete userData.newPassword;
        delete userData.confirmPassword;
      } else if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }
  
      const response = await updateUser(userData);
      console.log('更新响应:', response);

      if (response.data) {
        const res = await getUser(user.id);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        message.success('设置更新成功');
        form.resetFields(['newPassword', 'confirmPassword']);
        // 添加跳转逻辑
        navigate(`/personal`, { state:  res.data  });
      } else {
        throw new Error(response.msg || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      message.error(error.message || '更新失败');
    }
  };

  // 计算当前页的笔记
  const getCurrentPageNotes = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return notes.slice(startIndex, endIndex);
  };

  return (
    <>
      <Navbar />
      <div className={styles.settingContainer}>
        <div className={styles.settingCard}>
          <h1 className={styles.settingTitle}>个人设置</h1>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <div className={styles.formSection}>
              <Form.Item label="头像">
                {/* 头像上传功能预留 */}
              </Form.Item>

              <Form.Item
                label="昵称"
                name="nickname"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="当前密码"
                name="password"
              >
                <div style={{ fontSize: '16px', padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? user?.password : '•'.repeat(user?.password?.length || 0)}
                  <Button 
                    type="link" 
                    icon={showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: '8px' }}
                  />
                </div>
              </Form.Item>

              <Form.Item
                label="新密码"
                name="newPassword"
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                label="确认新密码"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                label="个人简介"
                name="content"
              >
                <Input.TextArea rows={4} size="large" />
              </Form.Item>

              <Form.Item
                label="生日"
                name="birthday"
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className={styles.notesSection}>
              <h2>展示笔记选择（最多选择3个）</h2>
              <div className={styles.notesList}>
                {getCurrentPageNotes().map(note => (
                  <div key={note.id} style={{ marginBottom: '10px' }}>
                    <Checkbox
                      checked={selectedNotes.includes(note.id)}
                      onChange={(e) => handleNoteSelect(note.id, e.target.checked)}
                    >
                      {note.title} {note.isPrivate === 1 && '(私密)'}
                    </Checkbox>
                  </div>
                ))}
              </div>
              {notes.length > 0 && (
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Setting;
