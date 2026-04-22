import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Col,
  Drawer,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import PostForm from '../components/PostForm';
import './index.less';

const { Title, Text } = Typography;

const BlogManagePage: React.FC = () => {
  const {
    posts,
    loading,
    loadPosts,
    loadTags,
    tags,
    deleteModel,
    handleEdit,
    setRecord,
    setEdit,
    setVisibleForm,
    visibleForm,
  } = useModel('blog.posts');

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    loadPosts();
    loadTags();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const filteredData = useMemo(() => {
    return posts.filter(p => {
      const matchSearch =
        !debouncedSearch ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [posts, debouncedSearch, statusFilter]);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string, rec: Blog.IPost) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, color: '#1a1a1a' }}>
            {val}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            /{rec.slug}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (val: string) =>
        val === 'published' ? (
          <Badge status="success" text={<span style={{ fontSize: 13 }}>Đã đăng</span>} />
        ) : (
          <Badge status="default" text={<span style={{ fontSize: 13 }}>Nháp</span>} />
        ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tagDetails',
      key: 'tags',
      width: 220,
      render: (tagDetails: Blog.ITag[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tagDetails?.slice(0, 3).map(tag => (
            <Tag
              key={tag._id}
              color={tag.color}
              style={{ fontSize: 11, padding: '0 6px', border: 'none', borderRadius: 4 }}
            >
              {tag.name}
            </Tag>
          ))}
          {tagDetails?.length > 3 && (
            <Tag style={{ fontSize: 11 }}>+{tagDetails.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      align: 'center' as const,
      sorter: (a: Blog.IPost, b: Blog.IPost) => a.views - b.views,
      render: (val: number) => (
        <Text style={{ fontWeight: 600, color: val > 200 ? '#52c41a' : '#666' }}>
          {val.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      align: 'center' as const,
      sorter: (a: Blog.IPost, b: Blog.IPost) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (val: string) => (
        <Text style={{ fontSize: 13 }}>{moment(val).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      align: 'center' as const,
      render: (_: any, rec: Blog.IPost) => (
        <Space size={4}>
          <Tooltip title="Xem bài viết">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => history.push(`/blog/${rec.slug}`)}
            />
          </Tooltip>
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
              title="Bạn có chắc muốn xóa bài viết này?"
              onConfirm={() => deleteModel(rec._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="blog-manage">
      {/* Header */}
      <div className="blog-manage__header">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý bài viết
          </Title>
          <Text type="secondary">
            Tổng {posts.length} bài &nbsp;·&nbsp;
            <span style={{ color: '#52c41a' }}>{publishedCount} đã đăng</span>
            &nbsp;·&nbsp;
            <span style={{ color: '#999' }}>{draftCount} nháp</span>
          </Text>
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
          Thêm bài viết
        </Button>
      </div>

      {/* Filters */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={14} md={10}>
          <Input
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8 }}
          />
        </Col>
        <Col xs={24} sm={10} md={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter || undefined}
            onChange={val => setStatusFilter(val || '')}
            allowClear
            style={{ width: '100%', borderRadius: 8 }}
            options={[
              { value: 'published', label: '✅ Đã đăng' },
              { value: 'draft', label: '📝 Nháp' },
            ]}
          />
        </Col>
      </Row>

      {/* Table */}
      <div className="blog-manage__table-wrap">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: total => `Tổng ${total} bài viết`,
            showSizeChanger: false,
          }}
          scroll={{ x: 800 }}
          size="middle"
          rowClassName="blog-manage__row"
        />
      </div>

      {/* Form Drawer */}
      <Drawer
        title={
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            {visibleForm ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </span>
        }
        open={visibleForm}
        onClose={() => setVisibleForm(false)}
        width={700}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
      >
        <PostForm />
      </Drawer>
    </div>
  );
};

export default BlogManagePage;
