import {
  createPost,
  deletePost,
  getEnrichedPosts,
  getTagsWithCount,
  updatePost,
} from '@/services/Blog';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [posts, setPosts] = useState<Blog.IPost[]>([]);
  const [tags, setTags] = useState<Blog.ITag[]>([]);
  const [loading, setLoading] = useState(false);
  const [formSubmiting, setFormSubmiting] = useState(false);
  const [record, setRecord] = useState<Blog.IPost>();
  const [visibleForm, setVisibleForm] = useState(false);
  const [edit, setEdit] = useState(false);

  const loadPosts = () => {
    setLoading(true);
    try {
      setPosts(getEnrichedPosts());
    } finally {
      setLoading(false);
    }
  };

  const loadTags = () => {
    setTags(getTagsWithCount());
  };

  const postModel = async (data: Omit<Blog.IPost, '_id' | 'views' | 'createdAt'>) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const result = createPost(data);
      loadPosts();
      message.success('Thêm bài viết thành công!');
      setVisibleForm(false);
      return result;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const putModel = async (id: string, data: Partial<Blog.IPost>) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const result = updatePost(id, data);
      loadPosts();
      message.success('Cập nhật bài viết thành công!');
      setVisibleForm(false);
      return result;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const deleteModel = async (id: string) => {
    try {
      deletePost(id);
      loadPosts();
      message.success('Xóa bài viết thành công!');
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleEdit = (post: Blog.IPost) => {
    setRecord(post);
    setEdit(true);
    setVisibleForm(true);
  };

  return {
    posts,
    tags,
    loading,
    formSubmiting,
    record,
    setRecord,
    visibleForm,
    setVisibleForm,
    edit,
    setEdit,
    loadPosts,
    loadTags,
    postModel,
    putModel,
    deleteModel,
    handleEdit,
  };
};
