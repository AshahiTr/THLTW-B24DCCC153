import { createTag, deleteTag, getTagsWithCount, updateTag } from '@/services/Blog';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [tags, setTags] = useState<Blog.ITag[]>([]);
  const [loading, setLoading] = useState(false);
  const [formSubmiting, setFormSubmiting] = useState(false);
  const [record, setRecord] = useState<Blog.ITag>();
  const [visibleForm, setVisibleForm] = useState(false);
  const [edit, setEdit] = useState(false);

  const loadTags = () => {
    setLoading(true);
    try {
      setTags(getTagsWithCount());
    } finally {
      setLoading(false);
    }
  };

  const postModel = async (data: Omit<Blog.ITag, '_id'>) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const result = createTag(data);
      loadTags();
      message.success('Thêm thẻ thành công!');
      setVisibleForm(false);
      return result;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const putModel = async (id: string, data: Partial<Blog.ITag>) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const result = updateTag(id, data);
      loadTags();
      message.success('Cập nhật thẻ thành công!');
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
      deleteTag(id);
      loadTags();
      message.success('Xóa thẻ thành công!');
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleEdit = (tag: Blog.ITag) => {
    setRecord(tag);
    setEdit(true);
    setVisibleForm(true);
  };

  return {
    tags,
    loading,
    formSubmiting,
    record,
    setRecord,
    visibleForm,
    setVisibleForm,
    edit,
    setEdit,
    loadTags,
    postModel,
    putModel,
    deleteModel,
    handleEdit,
  };
};
