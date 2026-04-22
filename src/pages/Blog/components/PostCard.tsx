import { EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Tag, Typography, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import { history } from 'umi';
import './PostCard.less';

const { Title, Paragraph, Text } = Typography;

interface PostCardProps {
  post: Blog.IPost;
  onTagClick?: (tagId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onTagClick }) => {
  const handleClick = () => {
    history.push(`/blog/${post.slug}`);
  };

  return (
    <div className="blog-post-card" onClick={handleClick}>
      <div className="blog-post-card__thumbnail">
        <img
          src={post.thumbnail || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80'}
          alt={post.title}
          loading="lazy"
        />
        <div className="blog-post-card__overlay" />
        <div className="blog-post-card__tags">
          {post.tagDetails?.slice(0, 3).map(tag => (
            <Tag
              key={tag._id}
              color={tag.color}
              style={{ cursor: 'pointer', marginBottom: 0 }}
              onClick={e => {
                e.stopPropagation();
                onTagClick?.(tag._id);
              }}
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      </div>

      <div className="blog-post-card__body">
        <Title level={4} className="blog-post-card__title" ellipsis={{ rows: 2 }}>
          {post.title}
        </Title>
        <Paragraph
          ellipsis={{ rows: 2 }}
          className="blog-post-card__summary"
        >
          {post.summary}
        </Paragraph>

        <div className="blog-post-card__meta">
          <Space size={16}>
            <Text type="secondary" className="blog-post-card__meta-item">
              <UserOutlined /> {post.author}
            </Text>
            <Text type="secondary" className="blog-post-card__meta-item">
              <CalendarOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}
            </Text>
            <Text type="secondary" className="blog-post-card__meta-item">
              <EyeOutlined /> {post.views.toLocaleString()}
            </Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
