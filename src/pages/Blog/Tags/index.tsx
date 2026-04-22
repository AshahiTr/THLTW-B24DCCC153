import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import './index.less';

const { Title, Text } = Typography;

const DEFAULT_COLORS = [
  '#f50', '#2db7f5', '#87d068', '#108ee9', '#e67e22',
  '#9b59b6', '#e74c3c', '#1abc9c', '#3498db', '#f1c40f',
];

const TagsManagePage: React.FC = () => {
  const {
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
  } = useModel('blog.tags');

  const [form] = Form.useForm();

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (!visibleForm) {
      form.resetFields();
    } else if (record?._id && edit) {
      form.setFieldsValue({
        name: record.name,
        slug: record.slug,
        color: record.color,
      });
    }
  }, [visibleForm, record?._id]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const onFinish = async (values: any) => {
    const color =
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString?.() || '#1677ff';

    const payload = { ...values, color };

    if (edit && record?._id) {
      await putModel(record._id, payload);
    } else {
      await postModel(payload);
    }
  };

  const columns = [
    {
      title: 'Thẻ',
      dataIndex: 'name',
      key: 'name',
      render: (val: string, rec: Blog.ITag) => (
        <Tag
          color={rec.color}
          style={{
            fontSize: 14,
            padding: '4px 14px',
            borderRadius: 20,
            border: 'none',
            fontWeight: 500,
          }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (val: string) => (
        <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {val}
        </Text>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 90,
      align: 'center' as const,
      render: (val: string) => (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: val || '#ccc',
            margin: '0 auto',
            border: '2px solid rgba(0,0,0,0.08)',
            boxShadow: `0 2px 6px ${val}40`,
          }}
        />
      ),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 120,
      align: 'center' as const,
      sorter: (a: Blog.ITag, b: Blog.ITag) => (a.postCount || 0) - (b.postCount || 0),
      render: (val: number) => (
        <Text strong style={{ color: val > 0 ? '#1677ff' : '#999' }}>
          {val || 0} bài
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 90,
      align: 'center' as const,
      render: (_: any, rec: Blog.ITag) => (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(rec)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa thẻ này?"
              description="Thẻ sẽ bị xóa khỏi tất cả bài viết."
              onConfirm={() => deleteModel(rec._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="blog-tags">
      {/* Header */}
      <div className="blog-tags__header">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <TagsOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Quản lý thẻ
          </Title>
          <Text type="secondary">Tổng {tags.length} thẻ</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setRecord(undefined);
            setEdit(false);
            setVisibleForm(true);
          }}
          style={{ borderRadius: 8 }}
        >
          Thêm thẻ mới
        </Button>
      </div>

      {/* Tag cloud preview */}
      <div className="blog-tags__cloud">
        {tags.map(tag => (
          <Tag
            key={tag._id}
            color={tag.color}
            style={{
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 0,
            }}
            onClick={() => handleEdit(tag)}
          >
            {tag.name}
            {tag.postCount !== undefined && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>({tag.postCount})</span>
            )}
          </Tag>
        ))}
      </div>

      {/* Table */}
      <div className="blog-tags__table-wrap">
        <Table
          dataSource={tags}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showTotal: total => `Tổng ${total} thẻ`,
          }}
          size="middle"
        />
      </div>

      {/* Modal Form */}
      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            {edit ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
          </span>
        }
        open={visibleForm}
        onCancel={() => setVisibleForm(false)}
        footer={null}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ!' }]}
          >
            <Input
              placeholder="Ví dụ: React, TypeScript..."
              onChange={e => {
                if (!edit) {
                  form.setFieldValue('slug', generateSlug(e.target.value));
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
          >
            <Input placeholder="react, typescript..." />
          </Form.Item>

          <Form.Item label="Màu sắc" required>
            <Row gutter={[8, 8]}>
              {DEFAULT_COLORS.map(color => (
                <Col key={color}>
                  <div
                    onClick={() => form.setFieldValue('color', color)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: color,
                      cursor: 'pointer',
                      border:
                        form.getFieldValue('color') === color
                          ? `3px solid #1677ff`
                          : '2px solid rgba(0,0,0,0.1)',
                      transition: 'all 0.15s',
                      boxShadow:
                        form.getFieldValue('color') === color
                          ? `0 0 0 2px rgba(22,119,255,0.2)`
                          : 'none',
                    }}
                    onMouseEnter={e =>
                      ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1.15)')
                    }
                    onMouseLeave={e =>
                      ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1)')
                    }
                  />
                </Col>
              ))}
            </Row>
            <Form.Item name="color" initialValue="#1677ff" noStyle>
              <Input type="hidden" />
            </Form.Item>
          </Form.Item>

          <div className="form-footer" style={{ marginTop: 8 }}>
            <Button loading={formSubmiting} htmlType="submit" type="primary">
              {edit ? 'Lưu lại' : 'Thêm mới'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsManagePage;
