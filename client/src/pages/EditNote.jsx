import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, message, Select } from 'antd'; // 引入 Ant Design 组件
import { updateNote, getNote } from '@/api/noteApi'; // 引入更新笔记和获取笔记的 API
import { getCategories } from '@/api/categoryApi'; // 引入获取分类信息的 API
import { useStore } from '@/store/userStore'; // 引入全局状态管理
import { useNavigate, useParams } from 'react-router-dom'; // 引入 React Router 的导航和路由参数钩子
import Navbar from '@/components/Navbar'; // 引入导航栏组件
import styles from './EditNote/EditNote.module.css';

const EditNote = () => {
  const navigate = useNavigate(); // 获取导航函数
  const { noteId } = useParams(); // 从路由参数中获取笔记 ID
  const { user } = useStore(); // 从全局状态中获取当前用户信息
  const [tags, setTags] = useState([]); // 标签状态。用于存储笔记中的标签
  const [inputTag, setInputTag] = useState(''); // 输入框中的内容
  const [categories, setCategories] = useState([]); // 分类状态。用于存储从 API 获取的分类数据
  const [form] = Form.useForm(); // 使用 Ant Design 的 Form.useForm 钩子管理表单

  // 使用 useEffect 钩子在组件加载时获取笔记和分类数据
  const [noteData, setNoteData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 同时请求笔记数据和分类数据
        const [noteResponse, categoriesResponse] = await Promise.all([
          getNote(noteId), // 获取指定 ID 的笔记
          getCategories(), // 获取所有分类
        ]);

        const fetchedNoteData = noteResponse.data; // 获取笔记数据
        setNoteData(fetchedNoteData); // 更新笔记数据状态
        setTags(fetchedNoteData.tags); // 设置笔记的标签
        setCategories(categoriesResponse.data); // 设置分类数据
      } catch (error) {
        console.error('Failed to fetch data:', error); // 打印错误信息
        message.error('获取数据失败'); // 使用 Ant Design 的 message 组件显示错误提示
      }
    };
    fetchData(); // 调用 fetchData 函数
  }, [noteId]); // 依赖项为 noteId

  useEffect(() => {
    if (noteData) {
      form.setFieldsValue({
        title: noteData.title,
        content: noteData.content,
        categoryId: noteData.categoryId,
        isPrivate: noteData.isPrivate,  // 添加权限字段
        tags: noteData.tags || [],
      });
      setTags(noteData.tags || []);
    }
}, [noteData, form]);

    // 提交表单时的处理函数
    const handleSubmit = async (values) => {
      try {
        const noteData = {
          ...values, // 展开表单提交的值
          tags, // 添加标签到笔记数据中
          userId: user.id, // 添加当前用户的 ID
        };
        await updateNote(noteId, noteData); // 调用 API 更新笔记
        message.success('笔记更新成功'); // 显示成功提示
        navigate('/notes',{state: user}); // 导航到笔记列表页面
      } catch (error) {
        console.error('Failed to update note:', error); // 打印错误信息
        message.error('更新笔记失败'); // 显示失败提示
      }
    };

    // 输入框内容变化时的处理函数
    const handleInputChange = (e) => {
      setInputTag(e.target.value); // 更新输入框中的内容
    };

    // 添加标签的处理函数
    const handleAddTag = () => {
      if (inputTag && !tags.includes(inputTag)) {
        // 如果输入框中有内容且标签未重复
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
        <div className={styles.editNoteContainer}>
          <h1 className={styles.editNoteTitle}>编辑笔记</h1>
          <Form
            form={form}
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
                    onChange={handleInputChange}
                    placeholder="输入标签"
                    style={{ width: 'calc(100% - 100px)' }}
                    size="large"
                    onPressEnter={handleAddTag}
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

            <Form.Item
              label="笔记权限"
              name="isPrivate"
              initialValue={0}
            >
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
                更新笔记
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  };

export default EditNote;