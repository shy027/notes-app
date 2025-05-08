import styles from './CreateNote/CreateNote.module.css';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, message, Select } from 'antd'; // 引入 Ant Design 组件
import { createNote } from '@/api/noteApi'; // 引入创建笔记的 API
import { getCategories } from '@/api/categoryApi'; // 引入获取分类的 API
import { useStore } from '@/store/userStore'; // 引入全局状态管理
import { useNavigate } from 'react-router-dom'; // 引入 React Router 的导航钩子
import Navbar from '@/components/Navbar'; // 引入导航栏组件

// 创建笔记页面组件
const CreateNote = () => {
  const navigate = useNavigate(); // 获取导航函数
  const { user } = useStore(); // 从全局状态中获取当前用户信息
  const [tags, setTags] = useState([]); // 标签状态，用于存储用户添加的标签
  const [inputTag, setInputTag] = useState(''); // 输入框中的标签内容
  const [categories, setCategories] = useState([]); // 分类状态，用于存储从 API 获取的分类数据

  // 使用 useEffect 钩子在组件加载时获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // 调用 API 获取分类
        setCategories(response.data); // 将获取到的分类数据存储到状态中
      } catch (error) {
        console.error('Failed to fetch categories:', error); // 打印错误信息
        message.error('获取分类失败'); // 使用 Ant Design 的 message 组件显示错误提示
      }
    };
    fetchCategories();
  }, []);

  // 提交表单时的处理函数
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const noteData = {
        ...values, // 展开表单提交的值
        tags, // 添加标签到笔记数据中
        userId: user.id, // 添加当前用户的 ID
        isPrivate: values.isPrivate,
      };
      await createNote(noteData); // 调用 API 创建笔记
      message.success('笔记创建成功'); // 显示成功提示
      navigate('/notes', { state: user }); // 导航到笔记列表页面
    } catch (error) {
      console.error('Failed to create note:', error); // 打印错误信息
      message.error('创建笔记失败'); // 显示失败提示
    }
  };

  // 输入框内容变化时的处理函数
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value); // 更新输入框中的标签内容
  };

  // 添加标签的处理函数
  const handleAddTag = () => {
    // 如果输入框中有内容且标签未重复
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]); // 将新标签添加到标签列表中
      setInputTag(''); // 清空输入框
    }
  };

  // 删除标签的处理函数
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag); // 过滤掉要删除的标签
    setTags(newTags); // 更新标签列表
  };
  // 渲染组件
  return (
    <>
      <Navbar />
      <div className={styles.createNoteContainer}>
        <h1 className={styles.createNoteTitle}>创建笔记</h1>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          className={styles.formContainer}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input 
              placeholder="请输入笔记标题" 
              size="large"
              style={{ fontSize: '1.1rem' }}
            />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <Input.TextArea 
              rows={10} 
              placeholder="请输入笔记内容"
              style={{ fontSize: '1.1rem' }}
            />
          </Form.Item>

          <Form.Item
            label="类型"
            name="categoryId"
            rules={[{ required: true, message: '请选择笔记类型' }]}
          >
            <Select 
              placeholder="请选择笔记类型"
              size="large"
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className={styles.tagSection}>
            <label className="block mb-2">标签</label>
            <div className={styles.tagInput}>
              <Input.Group compact>
                <Input
                  value={inputTag}
                  onChange={handleInputTagChange}
                  placeholder="输入标签"
                  style={{ width: 'calc(100% - 100px)' }}
                  size="large"
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleAddTag();
                  }}
                />
                <Button 
                  onClick={handleAddTag}
                  size="large"
                  type="primary"
                >
                  添加标签
                </Button>
              </Input.Group>
            </div>
            <div className={styles.tagList}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  style={{ 
                    fontSize: '1rem',
                    padding: '0.3rem 0.8rem',
                    margin: '0.3rem'
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <Form.Item label="笔记权限" name="isPrivate" initialValue={0}>
            <Select size="large">
              <Select.Option value={0}>公开</Select.Option>
              <Select.Option value={1}>私有</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              className={styles.submitButton}
              size="large"
            >
              创建笔记
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateNote;
