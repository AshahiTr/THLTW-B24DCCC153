import {
  SearchOutlined,
  TagsOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Col, Empty, Input, Pagination, Row, Spin, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import PostCard from './components/PostCard';
import './index.less';

const { Title, Text } = Typography;
const PAGE_SIZE = 9;

const BlogHomePage: React.FC = () => {
  const { posts, tags, loading, loadPosts, loadTags } = useModel('blog.posts');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    loadPosts();
    loadTags();
  }, []);

  // Debounce search 300ms
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 300);
  }, []);

  const handleTagFilter = (tagId: string) => {
    setSelectedTag(prev => (prev === tagId ? '' : tagId));
    setCurrentPage(1);
  };

  const publishedPosts = useMemo(
    () => posts.filter(p => p.status === 'published'),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(p => {
      const matchesSearch =
        !debouncedSearch ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesTag = !selectedTag || p.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [publishedPosts, debouncedSearch, selectedTag]);

  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  const selectedTagInfo = tags.find(t => t._id === selectedTag);

  return (
    <div className="blog-home">
      {/* Hero */}
      <div className="blog-home__hero">
        <div className="blog-home__hero-content">
          <div className="blog-home__hero-badge">
            <FileTextOutlined /> Blog cá nhân
          </div>
          <Title className="blog-home__hero-title">
            Chia sẻ kiến thức
            <br />
            <span className="blog-home__hero-accent">lập trình web</span>
          </Title>
          <Text className="blog-home__hero-desc">
            Những bài viết về React, TypeScript, UmiJS và các công nghệ frontend hiện đại
          </Text>

          <div className="blog-home__search-wrap">
            <Input
              prefix={<SearchOutlined className="blog-home__search-icon" />}
              placeholder="Tìm kiếm bài viết..."
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              className="blog-home__search"
              allowClear
              size="large"
            />
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="blog-home__filter">
        <div className="blog-home__filter-inner">
          <TagsOutlined className="blog-home__filter-icon" />
          <span className="blog-home__filter-label">Lọc theo thẻ:</span>
          <div className="blog-home__filter-tags">
            {tags.map(tag => (
              <Tag
                key={tag._id}
                color={selectedTag === tag._id ? tag.color : undefined}
                style={{
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: '3px 10px',
                  borderRadius: 20,
                  border: `1.5px solid ${tag.color || '#d9d9d9'}`,
                  color: selectedTag === tag._id ? '#fff' : tag.color || '#555',
                  background: selectedTag === tag._id ? tag.color : 'transparent',
                  transition: 'all 0.2s',
                }}
                onClick={() => handleTagFilter(tag._id)}
              >
                {tag.name}
                {tag.postCount !== undefined && (
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>({tag.postCount})</span>
                )}
              </Tag>
            ))}
          </div>

          {selectedTag && (
            <Tag
              closeIcon={<CloseCircleOutlined />}
              onClose={() => setSelectedTag('')}
              color="default"
              style={{ cursor: 'pointer' }}
            >
              Xóa lọc: {selectedTagInfo?.name}
            </Tag>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="blog-home__content">
        <div className="blog-home__count">
          <Text type="secondary">
            {filteredPosts.length > 0
              ? `Hiển thị ${pagedPosts.length} / ${filteredPosts.length} bài viết`
              : ''}
          </Text>
        </div>

        <Spin spinning={loading}>
          {pagedPosts.length === 0 ? (
            <Empty
              description={
                debouncedSearch || selectedTag
                  ? 'Không tìm thấy bài viết phù hợp'
                  : 'Chưa có bài viết nào'
              }
              style={{ margin: '64px 0' }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {pagedPosts.map(post => (
                <Col key={post._id} xs={24} sm={12} lg={8}>
                  <PostCard post={post} onTagClick={handleTagFilter} />
                </Col>
              ))}
            </Row>
          )}
        </Spin>

        {filteredPosts.length > PAGE_SIZE && (
          <div className="blog-home__pagination">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredPosts.length}
              onChange={page => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              showSizeChanger={false}
              showTotal={total => `Tổng ${total} bài viết`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHomePage;
