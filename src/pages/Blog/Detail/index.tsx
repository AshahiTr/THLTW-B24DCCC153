import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useParams } from 'umi';
import { getEnrichedPosts, getPostBySlug, incrementView } from '@/services/Blog';
import PostCard from '../components/PostCard';
import './index.less';

const { Title, Text, Paragraph } = Typography;

// Simple Markdown renderer (no external deps)
const renderMarkdown = (md: string): string => {
  return md
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Lists
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Paragraphs (lines not starting with <)
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>')
    // Clean double-wrapped <p><p>
    .replace(/<p><(h[1-6]|ul|li|pre|hr)/g, '<$1')
    .replace(/<\/(h[1-6]|ul|li|pre|hr)><\/p>/g, '</$1>')
    .replace(/<p><\/p>/g, '');
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Blog.IPost | undefined>();

  useEffect(() => {
    if (!slug) return;
    const found = getPostBySlug(slug);
    if (!found) {
      history.replace('/blog');
      return;
    }
    setPost(found);
    incrementView(found._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const all = getEnrichedPosts().filter(
      p => p.status === 'published' && p._id !== post._id,
    );
    return all
      .filter(p => p.tags.some(t => post.tags.includes(t)))
      .slice(0, 3);
  }, [post]);

  if (!post) return null;

  return (
    <div className="blog-detail">
      {/* Hero */}
      <div
        className="blog-detail__hero"
        style={{
          backgroundImage: `url(${post.thumbnail || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&q=80'})`,
        }}
      >
        <div className="blog-detail__hero-overlay" />
        <div className="blog-detail__hero-content">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/blog')}
            className="blog-detail__back-btn"
            ghost
          >
            Quay lại
          </Button>

          <div className="blog-detail__hero-tags">
            {post.tagDetails?.map(tag => (
              <Tag
                key={tag._id}
                color={tag.color}
                style={{ border: 'none', fontWeight: 500 }}
              >
                {tag.name}
              </Tag>
            ))}
          </div>

          <Title className="blog-detail__hero-title">{post.title}</Title>

          <div className="blog-detail__hero-meta">
            <span>
              <UserOutlined /> {post.author}
            </span>
            <span>
              <CalendarOutlined /> {moment(post.createdAt).format('DD MMMM YYYY')}
            </span>
            <span>
              <EyeOutlined /> {post.views.toLocaleString()} lượt xem
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="blog-detail__layout">
        <Row gutter={[32, 32]} justify="center">
          {/* Article */}
          <Col xs={24} xl={16}>
            <Card className="blog-detail__article" bordered={false}>
              {post.summary && (
                <div className="blog-detail__summary">
                  <Paragraph style={{ margin: 0, fontSize: 16, color: '#444', fontStyle: 'italic' }}>
                    {post.summary}
                  </Paragraph>
                </div>
              )}

              <div
                className="blog-detail__content markdown-body"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />

              <Divider />

              <div className="blog-detail__footer-tags">
                <Text strong style={{ marginRight: 8 }}>Thẻ:</Text>
                {post.tagDetails?.map(tag => (
                  <Tag key={tag._id} color={tag.color} style={{ marginBottom: 4 }}>
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Related */}
            {relatedPosts.length > 0 && (
              <div className="blog-detail__related">
                <Title level={4} className="blog-detail__related-title">
                  Bài viết liên quan
                </Title>
                <Row gutter={[20, 20]}>
                  {relatedPosts.map(p => (
                    <Col key={p._id} xs={24} sm={12} md={8}>
                      <PostCard post={p} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} xl={8}>
            {/* Author card */}
            <Card className="blog-detail__author-card" bordered={false}>
              <div className="blog-detail__author">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=DevBlog"
                  size={80}
                  className="blog-detail__author-avatar"
                />
                <div>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {post.author}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Full-stack Developer • React & Node.js
                  </Text>
                </div>
              </div>
              <Paragraph style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
                Đam mê chia sẻ kiến thức lập trình web, đặc biệt về React ecosystem, TypeScript và các công nghệ frontend hiện đại.
              </Paragraph>
              <Button
                type="primary"
                block
                style={{ borderRadius: 8 }}
                onClick={() => history.push('/blog/about')}
              >
                Xem trang giới thiệu
              </Button>
            </Card>

            {/* Tags in sidebar */}
            <Card
              title="Thẻ bài viết"
              bordered={false}
              style={{ marginTop: 16, borderRadius: 12 }}
              bodyStyle={{ paddingTop: 12 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {post.tagDetails?.map(tag => (
                  <Tag
                    key={tag._id}
                    color={tag.color}
                    style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20, border: 'none' }}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BlogDetailPage;
