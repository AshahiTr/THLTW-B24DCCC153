import { getTags } from '@/services/Blog';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const { TextArea } = Input;

const PostForm: React.FC = () => {
  const [form] = Form.useForm();
  const { record, visibleForm, edit, postModel, putModel, formSubmiting, setVisibleForm } =
    useModel('blog.posts');
  const tags = getTags();

  useEffect(() => {
    if (!visibleForm) {
      form.resetFields();
    } else if (record?._id && edit) {
      form.setFieldsValue({
        ...record,
        tags: record.tags,
      });
    }
  }, [visibleForm, record?._id]);

  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      tags: values.tags || [],
    };
    if (edit && record?._id) {
      await putModel(record._id, payload);
    } else {
      await postModel(payload);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[12, 0]}>
        <Col span={24}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input
              placeholder="Nhập tiêu đề bài viết"
              onChange={e => {
                if (!edit) {
                  form.setFieldValue('slug', generateSlug(e.target.value));
                }
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            name="slug"
            label="Slug (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
          >
            <Input placeholder="ten-bai-viet" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="status" label="Trạng thái" initialValue="draft">
            <Select
              options={[
                { value: 'draft', label: '📝 Nháp' },
                { value: 'published', label: '✅ Đã đăng' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="tags" label="Thẻ">
            <Select
              mode="multiple"
              placeholder="Chọn thẻ"
              options={tags.map(t => ({
                value: t._id,
                label: t.name,
              }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}
          >
            <TextArea rows={3} placeholder="Mô tả ngắn về bài viết..." showCount maxLength={300} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="content"
            label="Nội dung (Markdown)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea
              rows={14}
              placeholder="# Tiêu đề&#10;&#10;Nội dung bài viết viết theo định dạng Markdown..."
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="author"
            label="Tác giả"
            initialValue="Nguyễn Văn Dev"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
          >
            <Input placeholder="Tên tác giả" />
          </Form.Item>
        </Col>
      </Row>

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          {edit ? 'Lưu lại' : 'Thêm mới'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
      </div>
    </Form>
  );
};

export default PostForm;
